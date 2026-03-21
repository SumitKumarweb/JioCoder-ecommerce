# Safari & Firebase / hosting notes

## Safari (WebKit)

- **Sticky navbar**: `position: sticky` is ignored if a **parent** uses `overflow-x: hidden` (and similar). The `/code/[slug]` layout keeps horizontal clipping **below** `<Navbar />` so the header stays sticky on iOS/macOS Safari.
- **Viewport height**: `.jiocoder-min-h-viewport` uses `100vh` → `-webkit-fill-available` → `100dvh` so full-height layouts work on older Safari and iOS.
- **Playground `min()` heights**: `dvh` inside `min()` can invalidate the entire rule in browsers that don’t support `dvh`; the code playground uses **`vh`** there for compatibility.
- **Scroll areas**: `safari-momentum-scroll` (`-webkit-overflow-scrolling: touch`) is applied on the code editor and terminal for smoother iOS scrolling.

## Firebase Hosting (or any static host)

- Set **`NEXT_PUBLIC_SITE_URL`** to your live origin at **build time** (e.g. `https://www.jiocoder.com`) so metadata, sitemap, and client URLs stay correct.
- If you use **`output: 'export'`**, configure SPA-style **rewrites** to `index.html` only if you truly have no server; this app expects a **Node/Next server** for API routes and dynamic pages.
- For **Firebase Web Frameworks** or **Cloud Run** + Next, follow the official integration so `next start` (or the framework preset) handles routing—avoid double `Cache-Control` that strips HTML freshness if you rely on ISR.

## Quick checks

1. iPhone Safari: open `/code/javascript` — navbar should stick on scroll; editor/terminal should scroll smoothly.
2. macOS Safari: same pages; no horizontal “wiggle” unless content is intentionally wide.
