import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Try to repair truncated JSON by closing open strings/arrays/objects
function tryRepairJson(s: string): string {
  let str = s.trim();
  // strip code fences
  str = str.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  // Try parse as-is
  try { JSON.parse(str); return str; } catch {}

  // Walk and track structure
  let inString = false;
  let escape = false;
  const stack: string[] = [];
  let lastCompleteIdx = -1;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" || ch === "]") {
      stack.pop();
      if (stack.length === 1 && str[0] === "[") lastCompleteIdx = i; // completed top-level item
    }
  }

  // If we're inside the top-level array, try truncating to last completed object
  if (str[0] === "[" && lastCompleteIdx > 0) {
    const trimmed = str.slice(0, lastCompleteIdx + 1) + "]";
    try { JSON.parse(trimmed); return trimmed; } catch {}
  }

  // Close strings/structures
  let repaired = str;
  if (inString) repaired += '"';
  while (stack.length) {
    const top = stack.pop()!;
    repaired += top === "{" ? "}" : "]";
  }
  try { JSON.parse(repaired); return repaired; } catch {}
  return str;
}

async function callAI(body: any, lovableKey: string) {
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI ${res.status}: ${t.slice(0, 300)}`);
  }
  return await res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { book_id } = await req.json();
    if (!book_id) {
      return new Response(JSON.stringify({ error: "book_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: book, error: bookErr } = await supabase
      .from("book_submissions").select("*").eq("id", book_id).single();
    if (bookErr || !book) {
      return new Response(JSON.stringify({ error: "Book not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!book.manuscript_url) {
      return new Response(JSON.stringify({ error: "No manuscript uploaded" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: fileData, error: fileErr } = await supabase.storage
      .from("book-manuscripts").download(book.manuscript_url);
    if (fileErr || !fileData) {
      return new Response(JSON.stringify({ error: "Could not download manuscript" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    // Build base64 in chunks (avoid stack overflow on large PDFs)
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    const base64 = btoa(binary);
    const pdfDataUrl = `data:application/pdf;base64,${base64}`;

    // PASS 1: Get chapter outline (titles only) — small response
    const outlineResp = await callAI({
      model: "google/gemini-2.5-flash",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: `Look at this book PDF and list its chapters. Return ONLY a JSON array of chapter titles in reading order, no other text. If the book has no explicit chapters, divide it into 5-12 logical sections and name them.

Format: ["Chapter title 1", "Chapter title 2", ...]

Return ONLY the JSON array.` },
          { type: "image_url", image_url: { url: pdfDataUrl } },
        ],
      }],
      temperature: 0.1,
      max_tokens: 4000,
    }, lovableKey);

    const outlineRaw = outlineResp.choices?.[0]?.message?.content || "";
    let titles: string[] = [];
    try {
      titles = JSON.parse(tryRepairJson(outlineRaw));
    } catch (e) {
      console.error("Outline parse failed:", outlineRaw.slice(0, 500));
      return new Response(JSON.stringify({ error: "Could not read book structure. The PDF may be scanned, encrypted, or unreadable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!Array.isArray(titles) || titles.length === 0) {
      return new Response(JSON.stringify({ error: "No chapters detected in PDF" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    // Cap to a reasonable number
    titles = titles.slice(0, 30).map((t) => String(t || "").trim() || "Untitled");

    // PASS 2: Extract content for each chapter individually
    const chapters: { chapter_number: number; title: string; content: string }[] = [];
    for (let i = 0; i < titles.length; i++) {
      const num = i + 1;
      const title = titles[i];
      const prevTitle = titles[i - 1] || "(start of book)";
      const nextTitle = titles[i + 1] || "(end of book)";

      try {
        const chResp = await callAI({
          model: "google/gemini-2.5-flash",
          messages: [{
            role: "user",
            content: [
              { type: "text", text: `Extract the FULL text content of the chapter titled "${title}" (chapter ${num}) from this book PDF.

It comes AFTER: "${prevTitle}"
And BEFORE: "${nextTitle}"

Return ONLY the chapter's prose text. Preserve paragraph breaks as double newlines. Do NOT include the chapter title in the output. Do NOT add commentary, summaries, or markdown. Just the raw chapter text.` },
              { type: "image_url", image_url: { url: pdfDataUrl } },
            ],
          }],
          temperature: 0.1,
          max_tokens: 16000,
        }, lovableKey);

        const content = (chResp.choices?.[0]?.message?.content || "").trim();
        chapters.push({ chapter_number: num, title, content: content || `(Content for "${title}" could not be extracted.)` });
      } catch (e) {
        console.error(`Chapter ${num} failed:`, e);
        chapters.push({ chapter_number: num, title, content: `(Content for "${title}" could not be extracted.)` });
      }
    }

    // Save chapters
    await supabase.from("book_chapters").delete().eq("book_id", book_id);
    const { error: insertErr } = await supabase.from("book_chapters").insert(
      chapters.map((ch) => ({ book_id, ...ch }))
    );
    if (insertErr) {
      console.error("Insert error:", insertErr);
      return new Response(JSON.stringify({ error: "Failed to save chapters" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    await supabase.from("book_submissions").update({ total_chapters: chapters.length }).eq("id", book_id);

    return new Response(JSON.stringify({ success: true, chapters_extracted: chapters.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
