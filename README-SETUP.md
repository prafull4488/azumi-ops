## Azumi Ops — SPA setup & usage

This repository includes a single-file SPA at `index.html` that implements a lightweight file-based JSON DB workflow suitable for GitHub Pages.

Quick start

1. Open `index.html` in a browser (or serve with GitHub Pages).
2. Default seeded admin: username `admin`, password `admin123` — change immediately.
3. Use the `Download JSON` button to export current DB, or use `Save to Repo` to push `data/db.json` back to a repository (requires a GitHub token with repo access).

Files added

- `index.html` — single-page app (auth, scope sheet, clients, links, vendors, export).
- `data/db.json` — seed JSON DB with default admin.

Persistence notes

- The SPA loads `data/db.json` on first visit and then uses `localStorage` (`azumi.db`) for subsequent edits.
- To persist edits back to GitHub, click `Save to Repo` and provide a personal access token and repo path.

Security notes

- This is a simple file-based approach for demos. Passwords are stored in plain text in the JSON file — do not use for production.
- `jwt_secret` and passwords must be replaced with strong values if used beyond testing.

Hosting on GitHub Pages

1. Add/commit `index.html` and `data/db.json` to `main` branch.
2. In repository settings, enable GitHub Pages to serve from `main` branch root.
3. The site will be available at `https://<owner>.github.io/<repo>/`.

Export & Integration

- Export to PDF (client snapshot) via the `Export PDF` button.
- Download full DB via `Download JSON`.
- Push DB to repo via `Save to Repo` (requires token). The `Save to Repo` action uses GitHub API to `PUT` the file content.

Next steps you may want me to do

- Integrate bcrypt hashing for passwords in client-side (demo mode) and add a simple JWT implementation.
- Add a tiny server-side component (optional) to handle secure auth and persistence.
