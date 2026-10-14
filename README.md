# Botanica / 50Lemons — restored original booking app

This restores the original `index.html` booking experience and its existing booking flow, styles, scripts, map tiles, images, and icons. Next.js remains the framework and Cloudflare OpenNext deployment scripts are included.

## Key behavior

- `/` is internally rewritten to `/legacy.html`; the browser URL stays `/` (HTTP redirect is not used).
- The original booking application is preserved as `public/legacy.html` with its relative assets under `public/assets/`.
- No replacement booking UI or three-minute loading flow has been introduced.

## Run

```bash
npm install
npm run dev
```

## Cloudflare

```bash
npm run deploy
```

The Cloudflare Worker name is `botanica-v1`. If your existing production Worker uses another name, keep `name` in `wrangler.jsonc` aligned with that actual Worker. This configuration intentionally omits a self-service binding so first deployment does not fail when a self-referenced Worker does not yet exist.
