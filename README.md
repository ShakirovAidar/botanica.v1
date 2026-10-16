# 50Lemons — Phuket Villa Selection

English-only static booking prototype with light and dark modes implemented from the supplied Figma frames.

## Run the actual prototype

```sh
npm run dev:prototype
```

Open http://127.0.0.1:8080. This command needs only Node.js; it does not depend on Next.js. You can also open `index.html` directly. Use `?theme=light` or `?theme=dark` to preview a specific mode. The theme button saves your preference locally.

## Source files

- `index.html`: canonical static entry point.
- `assets/app.css`, `assets/app.js`: shared themed components and interactive flow.
- `assets/figma-assets.js`, `assets/figma/`: local original design assets.
- `assets/fonts/`: bundled Involve fonts and their license.
- `public/index.html`, `public/legacy.html`, `public/assets/`: synchronised static hosting copies.

After editing the prototype, run:

```sh
npm run prototype:sync
```

The existing Next.js wrapper is separate. `npm run build` builds that wrapper after `npm install`; `npm run dev` starts its placeholder route, not the static prototype. Cloudflare configuration serves `public/index.html` as an asset at the root.

## Behaviour and limits

The app includes a swipeable photo hero, budget filtering, project map with drag/zoom, project carousel, photo lightbox, messenger selection, consent validation and a prepared-request summary. It retains the original 16-project catalogue; map locations and prices are prototype data.

No backend is configured. Submission prepares an unsent request that can be copied; it does not send personal data anywhere. A real `/api/order` integration is a separate task.

See [DESIGN-IMPLEMENTATION.md](DESIGN-IMPLEMENTATION.md) for exact source frames, deliberate adaptations and the remaining Figma Starter limit affecting independent verification of the dark confirmation screen.
