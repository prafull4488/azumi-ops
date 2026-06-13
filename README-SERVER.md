Run the local server proxy

This simple Express server proxies the app to Postgres (useful when your browser cannot reach Supabase directly).

1. Create a `.env` file with your `DATABASE_URL` (Postgres connection string):

```
DATABASE_URL=postgresql://postgres:<YOUR_PASSWORD>@db.exihunuwtxxvykspvqml.supabase.co:5432/postgres
```

2. Install and run:

```bash
npm install
npm start
```

3. Open the frontend (if served from the same host) or set `window.SUPABASE_URL`/`window.SUPABASE_ANON_KEY` and use the Settings modal. The server exposes:
- `GET /api/data` — returns stored state (204 if empty)
- `POST /api/data` — upserts state into `kv` table (requires `kv` to exist)

Notes:
- The server uses `pg` and connects using `DATABASE_URL`.
- On Supabase, ensure the `kv` table exists with columns `key TEXT PRIMARY KEY` and `value JSONB` (see `supabase-init.sql` in the repo if present).
- For production, run behind a proper process manager and secure environment variables.
