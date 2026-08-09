# CA Desk

A professional toolkit web app for Chartered Accountants — invoicing, client
management, fee tracking, GST/TDS filing trackers, document expiry tracking,
and more. Installable as a Progressive Web App (PWA).

## Contents

```
.
├── index.html                       # Main app
├── manifest.json                    # PWA manifest
└── icons/
    ├── favicon.ico
    ├── icon-192x192.png
    ├── icon-512x512.png
    ├── icon-maskable-512x512.png
    └── apple-touch-icon.png
```

## Setup

1. Upload all files above to your repository, keeping the `icons/` folder
   structure intact.
2. `index.html` already links to the favicon, apple touch icon, and
   manifest in its `<head>` — no extra wiring needed as long as the
   `icons/` folder and `manifest.json` sit next to `index.html`.

## Deploying with GitHub Pages

1. Go to your repo's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
3. Choose the branch (e.g. `main`) and root folder (`/`), then save.
4. Your app will be live at `https://<username>.github.io/<repo-name>/`.

Once deployed, most mobile browsers will offer an "Add to Home Screen" /
"Install app" prompt using the manifest and icons above.

## Notes

- CA Desk requires an active internet connection to run (see the
  connectivity gate in `index.html`).
- Ad units are served via Adsterra and load on page open.
