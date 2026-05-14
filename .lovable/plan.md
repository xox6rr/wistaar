# Quieter chapter transitions — feel like a real book

You're right: a popping "Chapter 4 complete 🎉" toast breaks immersion. A real book never congratulates you — the page itself just changes. Here's what I'd do instead of the confetti spec from the earlier prompt.

## What to drop

- No toast / sonner notification when a chapter ends.
- No confetti, no emoji, no "X min read" popup.
- No book-completion modal card with celebration.

## What to add (all in-page, no overlays)

1. **End-of-chapter page itself**
   At the last page of each chapter, render a dedicated closing spread instead of a popup:
   - A small centered ornament (a thin horizontal rule, or a single ❦ / ✦ glyph in muted ink)
   - Below it, in small caps muted type: `End of Chapter 4`
   - Nothing else. No buttons, no stats. The next flip naturally lands on the next chapter title page (which already exists).

2. **Chapter opener already feels like a book** — keep current chapter title page; just refine it:
   - "Chapter 4" in tracked small-caps, hairline rule, then the chapter name in large serif. Generous top margin.

3. **Subtle progress, not announcements**
   - Keep the thin progress bar under the toolbar (already there).
   - When a chapter completes, briefly *dim* the progress bar from accent → muted for 600ms then back. No text, no sound.

4. **Optional, off by default**: a soft paper-rustle SFX on the chapter-end flip only (not every page). Toggle in settings, default off.

## Files to change

- `src/components/reader/PageFlipBook.tsx`
  - In `splitIntoPages`, append a synthetic "chapter end" page after each chapter's last content page (`kind: "chapter-end"`).
  - In the page renderer, branch on `kind`: render the ornament + "End of Chapter N" block.
- `src/pages/BookReader.tsx`
  - Remove any planned toast/confetti hook. Add a tiny `useEffect` that, when `getCurrentChapter()` increments, triggers a 600ms CSS class on the progress bar (`data-chapter-pulse`).
- `src/components/reader/ReaderToolbar.tsx`
  - Add `data-chapter-pulse` styling on the progress bar (opacity dip via Tailwind `transition-opacity`).
- No new deps. No `canvas-confetti`. No sonner calls from the reader.

## Acceptance

- Finishing a chapter shows only a quiet end-page; the next flip enters the next chapter.
- No popup, no emoji, no sound (unless user opts in later).
- Progress bar gives a one-time, sub-second visual acknowledgement and returns to normal.

Approve and I'll implement.
