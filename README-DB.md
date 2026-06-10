# Azumi Ops — Local DB Backend

This repository includes a minimal Express + SQLite backend to store the app state server-side instead of localStorage.

Quick start:

1. Install dependencies:

```bash
npm install
```

2. Run the server:

```bash
npm start
```

3. Open the app in your browser:

http://localhost:3000

What it does:
- Serves `index.html` from the project root.
- Provides `GET /api/data` to read the saved app state (JSON).
- Provides `POST /api/data` to replace the saved app state.

Supabase / Hosted Postgres (optional):
- You can use a hosted Postgres (for example Supabase) by setting the `DATABASE_URL` environment variable when starting the server. The server will detect `DATABASE_URL` and store the app state in Postgres instead of the local SQLite file.

Example (Linux / macOS):

```bash
export DATABASE_URL="postgres://..." \
	&& npm start
```

On Windows (PowerShell):

```powershell
$env:DATABASE_URL = 'postgres://...'
npm start
```

To get a `DATABASE_URL` from Supabase:
1. Create a project at https://app.supabase.com
2. Go to Project Settings → Database → Connection string and copy the `postgres://` URL (use the full connection string / password)
3. Use that value as `DATABASE_URL` when running the server.

Behavior:
- If `DATABASE_URL` is set the server stores the app state in Postgres (table `kv` with key `state`).
- If absent the server falls back to the bundled SQLite file `db.sqlite`.

Notes:
- The DB file `db.sqlite` is created in the project root. Add it to `.gitignore` if needed.
- The frontend currently uses localStorage. To migrate data to the DB, export your backup from the app and POST it to `/api/data` (or use the Import button when the server is running and the app is opened from the server).

Frontend syncing:
- The frontend will attempt to fetch `/api/data` on load and replace the local state if the server responds.
- Saving in the UI writes to `localStorage` and also POSTs to `/api/data` in background; if the server is unreachable the app still works offline using `localStorage`.

Using GitHub Pages + Supabase (recommended for static hosting):

1. Create a Supabase project at https://app.supabase.com and note your `SUPABASE_URL` and `anon` public key (API settings → Project API).
2. Create the `kv` table in Supabase SQL editor:

```sql
create table if not exists kv (
	key text primary key,
	value jsonb
);
```

3. Allow anonymous access for the `kv` table (for quick setup) by adding a simple policy in Supabase SQL editor. Example (developer convenience only — consider securing properly):

```sql
-- allow anon to read
create policy "anon_read_kv" on kv for select using (true);
-- allow anon to insert/update
create policy "anon_write_kv" on kv for insert, update using (true) with check (true);
```

4. In `index.html` (root of this repo) add your Supabase keys near the top of the file as shown in the placeholder comments:

```html
<script>
	window.SUPABASE_URL = 'https://yourproject.supabase.co';
	window.SUPABASE_ANON_KEY = 'public-anon-key';
</script>
```

5. Deploy the repo to GitHub Pages (branch `gh-pages` or `main` depending on your Pages settings). The frontend will directly sync with Supabase when loaded.

Security note: enabling wide-open anon policies is convenient for quick testing but insecure for production. For production, use Row-Level Security (RLS) with authenticated users, or proxy changes through a server (the `server.js` in this repo can be used with `DATABASE_URL`).
