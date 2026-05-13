import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { extractText, getDocumentProxy } from "https://esm.sh/unpdf@0.12.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

function repairJson(s: string): string {
  let str = s.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try { JSON.parse(str); return str; } catch {}
  // close open structures
  let inString = false, escape = false;
  const stack: string[] = [];
  for (const ch of str) {
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{" || ch === "[") stack.push(ch);
    else if (ch === "}" || ch === "]") stack.pop();
  }
  let r = str;
  if (inString) r += '"';
  while (stack.length) { const t = stack.pop()!; r += t === "{" ? "}" : "]"; }
  return r;
}

async function callAI(body: any, key: string) {
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI ${res.status}: ${t.slice(0, 400)}`);
  }
  return await res.json();
}

function splitByHeuristic(text: string): { title: string; content: string }[] {
  // Look for "Chapter N", "CHAPTER N", roman numerals as standalone lines
  const lines = text.split(/\r?\n/);
  const chapters: { title: string; content: string }[] = [];
  let current: { title: string; content: string } | null = null;
  const re = /^\s*(chapter\s+[0-9ivxlcdm]+|[0-9]+\.|\s*[IVXLCDM]+\.?)\s*[:\-]?\s*(.{0,80})?\s*$/i;
  for (const line of lines) {
    if (re.test(line) && line.trim().length < 100) {
      if (current) chapters.push(current);
      current = { title: line.trim(), content: "" };
    } else {
      if (!current) current = { title: "Chapter 1", content: "" };
      current.content += line + "\n";
    }
  }
  if (current) chapters.push(current);
  // If only one chapter or none, fallback to size-based split
  if (chapters.length <= 1) {
    const clean = text.trim();
    const target = 8000; // chars per chapter
    const parts: string[] = [];
    const paras = clean.split(/\n\s*\n/);
    let buf = "";
    for (const p of paras) {
      if ((buf + "\n\n" + p).length > target && buf) { parts.push(buf); buf = p; }
      else buf += (buf ? "\n\n" : "") + p;
    }
    if (buf) parts.push(buf);
    return parts.map((c, i) => ({ title: `Part ${i + 1}`, content: c.trim() }));
  }
  return chapters.map((c) => ({ ...c, content: c.content.trim() }));
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
      return new Response(JSON.stringify({ error: "book_id required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    console.log("[extract] book_id=", book_id);

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

    console.log("[extract] downloading", book.manuscript_url);
    const { data: fileData, error: fileErr } = await supabase.storage
      .from("book-manuscripts").download(book.manuscript_url);
    if (fileErr || !fileData) {
      console.error("[extract] download failed", fileErr);
      return new Response(JSON.stringify({ error: "Could not download manuscript: " + (fileErr?.message || "unknown") }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    console.log("[extract] pdf bytes=", bytes.length);

    // Try native PDF text extraction
    let nativeText = "";
    try {
      const pdf = await getDocumentProxy(bytes);
      const { text } = await extractText(pdf, { mergePages: true });
      nativeText = (text || "").trim();
      console.log("[extract] native text length=", nativeText.length);
    } catch (e) {
      console.error("[extract] native extract failed:", e);
    }

    const letterCount = (nativeText.match(/[a-zA-Z]/g) || []).length;
    let chapters: { chapter_number: number; title: string; content: string }[] = [];

    if (nativeText.length > 500 && letterCount > 200) {
      // Split natively extracted text
      const split = splitByHeuristic(nativeText);
      chapters = split.slice(0, 50).map((c, i) => ({
        chapter_number: i + 1,
        title: c.title || `Chapter ${i + 1}`,
        content: c.content || `(empty)`,
      }));
      console.log("[extract] native split chapters=", chapters.length);
    } else {
      // Fallback to vision OCR via AI
      console.log("[extract] using vision OCR fallback");
      let binary = "";
      const CHUNK = 0x8000;
      for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
      }
      const base64 = btoa(binary);
      const pdfDataUrl = `data:application/pdf;base64,${base64}`;

      const resp = await callAI({
        model: "google/gemini-2.5-flash",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: `Extract ALL text from this PDF and split into chapters. Return ONLY valid JSON in this exact shape:
[{"title":"Chapter title","content":"full chapter prose with double-newline paragraph breaks"}]

Rules:
- If the book has explicit chapters, use them.
- Otherwise split into 5-12 logical sections with descriptive titles.
- Preserve paragraph breaks (\\n\\n).
- Do NOT include the title inside content.
- Return ONLY the JSON array, no commentary or markdown.` },
            { type: "image_url", image_url: { url: pdfDataUrl } },
          ],
        }],
        temperature: 0.1,
        max_tokens: 32000,
      }, lovableKey);

      const raw = resp.choices?.[0]?.message?.content || "";
      let parsed: any;
      try { parsed = JSON.parse(repairJson(raw)); } catch (e) {
        console.error("[extract] OCR parse failed:", raw.slice(0, 500));
        return new Response(JSON.stringify({ error: "Could not read book content. PDF may be encrypted or unreadable." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return new Response(JSON.stringify({ error: "No content detected in PDF" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      chapters = parsed.slice(0, 50).map((c: any, i: number) => ({
        chapter_number: i + 1,
        title: String(c.title || `Chapter ${i + 1}`).trim(),
        content: String(c.content || "").trim() || "(empty)",
      }));
    }

    if (chapters.length === 0) {
      return new Response(JSON.stringify({ error: "No chapters extracted" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await supabase.from("book_chapters").delete().eq("book_id", book_id);
    const { error: insertErr } = await supabase.from("book_chapters").insert(
      chapters.map((ch) => ({ book_id, ...ch }))
    );
    if (insertErr) {
      console.error("[extract] insert error", insertErr);
      return new Response(JSON.stringify({ error: "Failed to save chapters: " + insertErr.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    await supabase.from("book_submissions").update({ total_chapters: chapters.length }).eq("id", book_id);
    console.log("[extract] saved", chapters.length, "chapters");

    return new Response(JSON.stringify({ success: true, chapters_extracted: chapters.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[extract] unexpected", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
