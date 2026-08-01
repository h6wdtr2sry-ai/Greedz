# MLBB Auto-Collage

Production-scaffold for a Mobile Legends: Bang Bang squad-graphic / skin-collage
builder — 7 layout templates, 12 rarity tiers with auto-applied frame theming,
per-cell photo editing, a text/rank engine, and multi-preset high-res export.

## Stack

Next.js 14 (App Router) · TypeScript · Zustand · Tailwind + Radix primitives ·
Framer Motion · Fuse.js · react-window · html-to-image.

## Getting started

```bash
npm install
cp .env.example .env.local   # point at your own asset CDN(s)
npm run dev
```

Open http://localhost:3000.

## About the skin artwork

Moonton owns MLBB's skin art — this repo does not ship or embed it. Instead:

- `data/skins.ts` defines the `Skin` schema and a ~45-entry **seed dataset**
  (hero/skin *names* only, which are public game facts) so every role, tier,
  and the search/filter UI have real data to exercise out of the box.
- Every skin resolves its image URLs via `buildAssetUrl()` against
  `NEXT_PUBLIC_MLBB_CDN_PRIMARY` / `_FALLBACK` — point these at an asset
  source you're actually authorized to serve (your own bucket, a licensed
  partner, a self-hosted mirror).
- For the full 1,120+ catalogue, host a JSON file matching the `Skin[]`
  shape and set `NEXT_PUBLIC_MLBB_CATALOGUE_URL`. `loadFullSkinCatalogue()`
  fetches it server-side (hourly ISR) and merges it over the seed set —
  nothing else in the app needs to change.
- **CORS**: every resolved URL is wrapped by `proxied()` before it's used in
  an `<img>`/canvas context, routing it through `/api/proxy-image`. That
  route streams the bytes back same-origin so `html-to-image`'s
  `toBlob()`/`toDataURL()` never throws a tainted-canvas `SecurityError`.
  **Update `ALLOWED_HOSTS` in `app/api/proxy-image/route.ts`** to your real
  CDN hostnames before deploying — as written it will refuse unknown hosts.

## Architecture

```
types/mlbb.ts              All domain interfaces (Skin, LayoutTemplate, CollageCell, …)
data/skins.ts               Seed catalogue + CDN URL builder + CORS proxy helper
data/layouts.ts              7 layout templates (fractional cell coordinates, 0–1)
data/tiers.ts                Rarity → frame theme map, metallic border gradients, export presets
store/collageStore.ts        Zustand store — single source of truth for the whole editor
components/collage/
  Canvas.tsx                  Renders background + cells + text layers; drag/zoom/pan via pointer events
  SidebarControls.tsx          Layout / Cell / Scene / Text tabs
  ExportBar.tsx                 Preset + format picker, wired to lib/export.ts
  CollageApp.tsx                 Client shell: responsive drawer + wiring
components/modals/
  SkinPickerModal.tsx           Fuse.js fuzzy search + react-window virtualized grid
components/ui/                Radix-based primitives (button, slider, tabs, select, dialog, label)
app/api/proxy-image/route.ts  CORS-safe image proxy (allowlisted hosts)
app/page.tsx                  Server component — loads catalogue, hands off to CollageApp
lib/export.ts                 html-to-image export pipeline (2x pixelRatio for crisp mobile output)
```

State flows one way: every control in the sidebar reads/writes
`useCollageStore`, and `Canvas.tsx` is a pure function of that state — so
what you see on screen is exactly what gets serialized on export.

## Export resolution strategy

Export presets (`data/tiers.ts`) render at `pixelRatio: 2` — e.g. the
1080×1920 TikTok/Story preset serializes at an effective 2160×3840 — so
output doesn't look soft on high-DPI phone screens. `lib/export.ts` forces
the exact preset pixel dimensions on the captured node regardless of its
on-screen responsive size, waits two animation frames for pending state to
paint, then hands off to `html-to-image`'s `toBlob()`.

## Performance for 1,120+ skins

- The picker grid is virtualized with `react-window`'s `FixedSizeGrid` — only
  visible rows mount, so scrolling stays smooth regardless of catalogue size.
- The Fuse.js search index is rebuilt only when the catalogue array changes
  (not per keystroke), keeping search input responsive.
- The full catalogue is fetched server-side with ISR, keeping it out of the
  client JS bundle; only the resolved JSON ships to the browser.

## Deploying to Vercel

```bash
vercel
```

Set `NEXT_PUBLIC_MLBB_CDN_PRIMARY`, `NEXT_PUBLIC_MLBB_CDN_FALLBACK`, and
`NEXT_PUBLIC_MLBB_CATALOGUE_URL` (if used) as Environment Variables in the
Vercel project settings, and add every real asset hostname to
`images.remotePatterns` in `next.config.js` and `ALLOWED_HOSTS` in the proxy
route.

## Known gaps to fill in before shipping

- Swap the seed dataset for your real, licensed catalogue.
- Wire real rarity frame PNGs (`frameBorderUrl`) if you want painted frame
  art instead of the current CSS glow/gradient treatment.
- Add auth + persistence if you want saved projects (the store is currently
  in-memory only — a refresh clears the canvas).
