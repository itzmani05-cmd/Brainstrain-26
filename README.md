# Brainstrain '26

Website for **Brainstrain '26**, the inter-collegiate literary fest hosted by the Literary and
Debating Society, GCT Coimbatore. Built with React + Vite + Tailwind CSS v4 as a fully static
frontend — no backend, database, or auth involved.

## Stack

- **Frontend:** React 19, React Router, Tailwind CSS v4
- **Content:** Event details live in `src/data/events.json`, bundled at build time.

## Project structure

```
src/
  components/        shared UI (Navbar, Footer, NeonButton, EventCard, CountdownTimer, ...)
  data/              static team roster, event content (events.json) and event image map
  pages/             Home, Events, EventDetail, Team, Register
```

## Editing event content

All event content (name, slug, description, guidelines, rules, contact, prize pool, team size,
registration status) lives in `src/data/events.json` as a plain array. Edit that file directly to
add, remove, or update an event — no rebuild step beyond the normal `npm run build` is needed.

Event poster art lives in `src/assets/events/*.png` (bundled at build time) — an event's
`image_url` field stores the matching key (e.g. `"adzap"`), resolved via
`src/data/eventImages.js`. `resolveEventImage` also treats any `http(s)://` value as a direct URL
if you want to link an external image instead.

The Register page reads the same `events.json` to list events and their team-size requirements,
but registrations are not collected in-app — visitors are pointed to the contact details in the
page (and in the footer) to register directly.

## Run the project

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Route map

| Route | Description |
| --- | --- |
| `/` | Home |
| `/events` | Event list |
| `/events/:slug` | Event detail |
| `/team` | Our Team |
| `/register` | Event picker + contact info to register |

## Notes

- The "Our Team" roster (`src/data/teamData.js`) is static content, matching the Figma design.
