# 50Lemons Figma implementation

Source file: `0CvGmpJvmjaB9u7BwytbXs`. The static app uses the Light Mode section `15:824`, Dark Mode section `22:1512`, and referenced component instances from `15:702`.

Implemented frames: light home `15:825`, budget `15:898`, map `15:1004`, sheet `15:1094`, contact `15:1216`, confirmation `15:1312`; dark home `22:1513`, budget `22:1551`, map `22:1607`, sheet `22:1637`, contact `22:1702`.

Figma Starter stopped serving additional design calls before the dark confirmation frame `22:1742` and standalone component variants could be retrieved. Dark confirmation therefore uses the light confirmation layout with the received dark palette. It has not been independently matched to that frame.

## Deliberate adaptations

- English only. The language control is replaced by an accessible theme switch. Default follows the OS; a saved choice takes precedence, and `?theme=light` or `?theme=dark` overrides it on load.
- Real browser safe areas replace decorative iOS status bars and home indicators.
- Both themes use the same catalogue. Counts are computed from the existing 16 projects; the high dark budget contains two projects, rather than the six stated in the Figma example.
- Both modes use Botanica branding, hero statistics, FAQ labels and reservation copy from the dark design. Dark mode retains its three budget ranges.
- In both modes, the contact form starts with messenger selection, the contact field and consent, followed by the selection recap. DOM order matches visual and keyboard order. Header logos, full wordmarks, metadata and browser icons use Botanica branding.
- The supplied Figma basemap is retained, and existing project coordinates are projected into its viewport. Map locations remain approximate, as in the original prototype. Drag, pinch, mouse-wheel and keyboard map controls are supported.
- The app stays mobile-first and centred at up to 560px on desktop, since no desktop frame was supplied.
- There is no order backend. The form prepares an in-memory request, identifies it as unsent and lets the user copy it. It never claims that a server received the request. A real `/api/order` integration remains separate.

## Assets and typography

Original PNGs and SVGs were downloaded from the design responses and stored locally under `assets/figma`. `manifest.json` records source node references without temporary download URLs. The Botanica wordmark uses the original exported glyph assets; the mark uses its original luminance mask.

Involve Medium and Bold are bundled locally from the [font author's repository](https://github.com/StefanPeev/Involve), revision `e257a5a23f1e53e782008f36d03d6c91449f832baf`. Their SIL Open Font License is in `assets/fonts/OFL.md`.

## Running and synchronising

`npm run dev:prototype` starts the actual static app on `http://127.0.0.1:8080`. It does not require Next.js or npm dependencies. `PORT` changes the port.

`npm run prototype:sync` copies the canonical root HTML and assets into `public/index.html`, `public/legacy.html` and `public/assets`. Run it after changing the prototype. The Next.js placeholder in `src/app/page.tsx` remains separate from the prototype.
