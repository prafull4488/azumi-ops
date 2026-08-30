# Azumi Designs — Website

A real React + Vite web app (not a static mockup) built for Azumi Designs, a woman-led
architecture & interior design studio in Goa.

## Tech

- **React 19 + Vite** — component-based app, fast dev server, optimized production build
- **GSAP** — scroll-driven reveals, the masked-heading text reveal, and the masonry gallery
- **ogl** (WebGL) — the animated light-ray background in the hero
- **motion** (`motion/react`) — the process Stepper's spring transitions
- Real React Bits-style components, adapted and restyled for this brand:
  - `LightRays` -> hero background
  - `ScrollExpand` + `MaskedHeading` -> the hero's scroll-driven image reveal + masked headline
  - `AccordionGallery` -> the Projects "depth carousel"
  - `Masonry` -> the "Designing with Goa" materials gallery
  - `Stepper` -> the Process section
  - `ReflectiveCard` (adapted into `FounderCard`, photo instead of webcam) -> the Founder card

## Fonts

Outfit (display/headings) + DM Sans (body) + Space Mono (labels/numbers), loaded from Google Fonts.

## Running it locally

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

The production build uses ES modules, so **open it through a server**, not by double-clicking
`dist/index.html` (browsers block module scripts over `file://`). `npm run preview`, or any
static host (Netlify, Vercel, GitHub Pages, S3, nginx, etc.), works fine — `vite.config.js`
already sets `base: './'` so the build is portable to any subpath.

## Admin panel

Click **"Admin"** in the footer to edit hero copy/image, projects, the studio statement,
services, process steps (and which service each one applies to), the founder bio, the Goa
gallery, journal posts, FAQ, and contact details.

This build persists admin edits to the browser's `localStorage`, so they're **per-browser**,
not shared across visitors — there's no backend yet. To make edits visible to everyone, wire
`src/store/useSiteData.jsx` up to a real backend or headless CMS (a small API route, Supabase,
Sanity, etc. would all work) — the rest of the app already reads all content from that one
context, so nothing else needs to change.

## Content

Default/placeholder copy and images live in `src/data/defaultData.js`. Swap in real project
photography there (or via the Admin panel) — the placeholder images are generic stock photos.

## Structure

```
src/
  components/       # the animation components (LightRays, ScrollExpand, MaskedHeading,
                     # AccordionGallery, Masonry, Stepper, FounderCard), each with its own CSS
  sections/          # one file per page section (Hero, Projects, About, Services, Process,
                     # Founder, Goa, Journal, Faq, Contact, Footer, AdminPanel)
  data/defaultData.js
  store/useSiteData.jsx   # content context + localStorage persistence
  sections.css        # shared section layout/styles
  index.css            # design tokens (colors, fonts, spacing)
```
