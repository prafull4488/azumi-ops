# Netlify Forms — Contact form setup

The contact form is wired to **Netlify Forms** (no API keys, no backend).

## How it works
- A hidden static `<form name="contact" data-netlify="true">` lives in `index.html` so Netlify's
  build-time bot can detect and register the form.
- The visible React form (`src/sections/Contact.jsx`) submits via AJAX (`fetch` POST to `/`)
  with `form-name=contact`, so submissions are recorded on Netlify while keeping the on-page
  "Thanks — we'll be in touch shortly." toast.
- A honeypot field (`bot-field`) filters basic spam.

> Note: Netlify Forms ONLY records submissions on the deployed Netlify site.
> In the local/preview environment the POST is expected to fail — the code catches this and still
> shows the success toast so the demo works.

## One-time step: send enquiries to azumidesigns@gmail.com
After deploying to Netlify:
1. Netlify dashboard → your site → **Forms**.
2. Open the **contact** form → **Settings & notifications** (Form notifications).
3. **Add notification → Email notification**.
4. Set the recipient to **azumidesigns@gmail.com** and save.

That's it — every submission will now email azumidesigns@gmail.com (and appear under Forms in the dashboard).
