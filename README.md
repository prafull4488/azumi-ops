# Azumi Hub

A mobile-first web app for the Azumi Designs team: Scope Sheet, Client Details, and
Important Links, with JWT login and role-based access (admin / member), backed by SQLite.

---

## 1. Requirements

- Node.js 18+ (Termux: `pkg install nodejs`)
- npm (comes with Node)

## 2. Install & Run

```bash
cd azumi-app
npm install
npm start
```

You should see:

```
Azumi Hub running!
Local:   http://localhost:3000
Network: http://<your-device-ip>:3000

Default admin login (if first run): admin / admin123
```

A file `azumi.db` (SQLite) is created automatically on first run, with one seed admin
account: **username `admin`, password `admin123`**. Log in and change this password
(or just create your own account and have someone promote it to admin via the
`/api/users/:id/role` endpoint — see below).

> Note: the very first signup made with `role: "admin"` (before any admin exists)
> will also become an admin automatically. After that, all signups default to
> `member`. Use an existing admin to promote others.

---

## 3. Running on a Phone via Termux

1. Install Termux from F-Droid (Play Store version is outdated).
2. Inside Termux:
   ```bash
   pkg update && pkg upgrade
   pkg install nodejs git
   ```
3. Copy this project folder onto the phone (e.g. via `git clone`, USB transfer, or
   `termux-setup-storage` + copy from `/sdcard`).
4. Inside the project folder:
   ```bash
   npm install
   npm start
   ```
5. Find your phone's local IP address (Settings → Wi-Fi → network details, or run
   `ifconfig` / `ip addr` in Termux — look for `wlan0`, e.g. `192.168.1.42`).
6. Teammates on the **same Wi-Fi network** can open:
   ```
   http://192.168.1.42:3000
   ```
   in their browser.

### Keeping it running

- Don't let the phone sleep/lock the Termux session: enable "Acquire wakelock" from
  the Termux notification, or run `termux-wake-lock`.
- To keep the server alive after closing the terminal, you can use `tmux`:
  ```bash
  pkg install tmux
  tmux new -s azumi
  npm start
  # detach with Ctrl+B then D; reattach later with: tmux attach -t azumi
  ```

---

## 4. Sharing Outside Local Wi-Fi (ngrok)

If teammates aren't on the same network, use ngrok to create a temporary public URL:

1. Install ngrok (Termux):
   ```bash
   pkg install wget unzip
   wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-arm64.zip
   unzip ngrok-v3-stable-linux-arm64.zip
   ```
   (Or download the appropriate build from https://ngrok.com/download for your device's
   architecture.)
2. Sign up at ngrok.com, get your auth token, then run:
   ```bash
   ./ngrok config add-authtoken <YOUR_TOKEN>
   ```
3. With the app running (`npm start` on port 3000) in one Termux session, open another
   session/tab and run:
   ```bash
   ./ngrok http 3000
   ```
4. ngrok prints a public URL like `https://abcd-1234.ngrok-free.app` — share this with
   your team. It tunnels straight to the app on your phone.

> Free ngrok URLs change every time you restart it, and have usage limits. For a
> longer-lived link, consider an ngrok paid plan with a reserved domain.

---

## 5. Project Structure

```
azumi-app/
├── server.js          # Express server, SQLite, auth, REST API
├── package.json
├── azumi.db            # created automatically (SQLite database file)
└── public/
    └── index.html      # full frontend (HTML/CSS/JS, no build step)
```

---

## 6. API Overview

All endpoints except `/api/auth/signup` and `/api/auth/login` require a header:
`Authorization: Bearer <token>`

| Method | Path                  | Description                          | Access        |
|--------|-----------------------|---------------------------------------|---------------|
| POST   | /api/auth/signup      | Create account                        | public        |
| POST   | /api/auth/login       | Log in, get JWT                       | public        |
| GET    | /api/auth/me          | Get current user info                 | logged in     |
| GET    | /api/users            | List all users                        | admin         |
| PATCH  | /api/users/:id/role   | Change a user's role                  | admin         |
| GET/POST | /api/scope           | List / add scope items              | logged in     |
| PUT/DELETE | /api/scope/:id     | Update / delete scope item          | logged in*    |
| GET/POST | /api/clients         | List / add clients                  | logged in     |
| PUT/DELETE | /api/clients/:id   | Update / delete client              | logged in*    |
| GET/POST | /api/links           | List / add links                    | logged in     |
| PUT/DELETE | /api/links/:id     | Update / delete link                | logged in*    |

\* Deleting an item created by another user requires the `admin` role; members can
delete only their own entries. Edits (PUT) are open to any logged-in user so the team
can keep shared sheets up to date.

---

## 7. Security Notes

- Passwords are hashed with **bcrypt** before being stored.
- Authentication uses **JWT** (7-day expiry), sent as `Authorization: Bearer <token>`
  and stored client-side in `localStorage`.
- Change `JWT_SECRET` in `server.js` (or set the `JWT_SECRET` environment variable)
  before sharing this app beyond trusted local use — the default value is **not**
  secure for production / public exposure.
- If exposing via ngrok to the public internet, treat it as a public deployment:
  change the default admin password immediately and use a strong `JWT_SECRET`.

---

## 8. Customization Ideas

- Add edit-in-place for client/link rows (currently add + delete; status update is
  inline for scope items).
- Add CSV export for the scope sheet.
- Add per-project grouping if managing multiple projects at once.
