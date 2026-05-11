## Diagnosis

Your Lovable preview works, only Vercel is broken. The screenshot shows:
- HTML/text renders fine (React is running)
- Serif font from Google Fonts loads
- **No Tailwind utility classes are applied** (no layout, no colors, no spacing)
- Dark background = browser default, not your ivory theme

This is **not** a Supabase or code problem. The project files (`vercel.json`, `package.json`, `vite.config.ts`, Tailwind setup) are all correct and Lovable builds them fine. The issue is **Vercel's project settings** — it's either skipping the Vite build or serving the wrong directory.

A secondary risk: Vercel almost certainly doesn't have your `VITE_SUPABASE_*` env vars, which will silently break auth/data fetching even after the styling is fixed.

## Fix (no code changes — all Vercel dashboard)

This is a configuration fix on **vercel.com**, not in your code. Open your project on Vercel and do the following.

### Step 1 — Fix build settings

Go to **Vercel → your project → Settings → General → Build & Development Settings**, click **Edit**, and set:

| Field | Value |
|---|---|
| Framework Preset | **Vite** |
| Build Command | `vite build` (or leave as default Override OFF) |
| Output Directory | `dist` |
| Install Command | `npm install` (default) |
| Root Directory | `./` (leave blank/default) |
| Node.js Version | 20.x |

Save.

### Step 2 — Add environment variables

Go to **Settings → Environment Variables** and add these three (apply to **Production, Preview, and Development**):

```text
VITE_SUPABASE_URL              = https://jxlpxworxpjjhavtkrqu.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY  = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bHB4d29yeHBqamhhdnRrcnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NTk2OTMsImV4cCI6MjA4MjAzNTY5M30.w3_iCHEbqRLzj8JF-hVuY9M7OfPxkYhszjGYd-VzD5Q
VITE_SUPABASE_PROJECT_ID       = jxlpxworxpjjhavtkrqu
```

(These are public anon keys — safe to put in Vercel.)

### Step 3 — Redeploy from scratch

Go to **Deployments → latest deployment → ⋯ menu → Redeploy** and **uncheck** "Use existing Build Cache". This forces a clean rebuild with the new settings and env vars.

### Step 4 — Verify

Once the redeploy finishes:
1. Open the Vercel URL in an incognito window (avoid cached CSS).
2. The site should now show ivory background, terracotta accents, proper navigation bar, card layouts.
3. Open DevTools → Network → filter by `.css` — you should see an `index-[hash].css` file ~50–100 KB loading with status 200.

If CSS is still missing after this, check **Vercel → Deployments → [latest] → Build Logs** and look for any `tailwindcss` or `postcss` errors during `vite build`.

## Why this happened

When you imported/created the Vercel project, it likely auto-detected the wrong framework (e.g. "Other" with no build step), so it deployed your raw source files instead of the built `dist/` output. The browser then loads the React app via JS but never gets the compiled Tailwind CSS bundle — exactly what your screenshot shows.

## What I will NOT change

No code, no `vercel.json`, no Tailwind config — those are all correct. The fix is 100% in the Vercel dashboard. After you complete Steps 1–3, tell me if it's still broken and share the Vercel build log; I'll diagnose from there.
