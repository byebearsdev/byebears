# $ALTSZN — itsaltseason.com

An 8-bit arcade landing page. Vanilla JS + CSS, bundled with Vite. No UI framework.

## Getting started

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # production build → dist/
npm run preview  # serve the built output
```

Deploy the contents of `dist/`. The build uses a relative `base`, so it works
from a domain root or a sub-path without reconfiguration.

## How the page is assembled

`index.html` is a near-empty shell. Everything is rendered by `src/main.js` in
two strict phases:

1. **Render** — every component returns an HTML string; they are concatenated
   and injected into `<body>` in one pass.
2. **Init** — behaviour is attached to a DOM that is already complete.

Components are inserted as *direct children of `<body>`* rather than inside a
wrapper, because `styles/responsive/mobile-portrait.css` hides the page behind
the rotate-device gate using `body > *:not(.rotate-device-overlay)`.

Each module exports a `PascalCase()` render function and, where it has
behaviour, a matching `initPascalCase()`.

## Layout

```
index.html              shell — title, favicons, font, critical background colour
vite.config.js
public/images/          all media, served at /images/… (paths unchanged from before)
reference/              the pre-refactor single-file page, kept for comparison
scripts/                verification tooling (see below)

src/
  main.js               render → inject → init, plus the start-up chain
  config/site.js        contract address, every outbound URL, media ids
  data/                 pure content: seasons, menu, snacks,
                        terminal copy, phone app buttons, icons, bgm track
  core/                 audio-context, audio-nodes, sfx, bgm, clipboard, dom
  components/           reusable, data-driven pieces
  sections/             the seven scrolling page sections
  overlays/             anything that covers the page
  chrome/               persistent furniture (marquee, header, buttons)
  features/             cross-cutting behaviour (scroll sfx, video audio, …)
  styles/
    main.css            import manifest — the import order IS the cascade order
    base/               tokens, reset, shared animations, scrollbar
    components/ layout/ sections/ overlays/ responsive/
```

## Start-up sequence

The page is gated behind a click because browsers only allow audio to begin
from a real user gesture:

```
CHECK IN  →  departures board  →  loading bar  →  page revealed
   │                                                │
   └─ warms every AudioContext,                     └─ starts the section-video
      primes iOS media session,                        audio observers, plays the
      unlocks the background videos                    announcement, then the music
```

Each step hands over via a callback passed from `main.js`, so the order is
visible in one place.

## Conventions

- **Design tokens** live in `styles/base/tokens.css`. Use `var(--color-gold)`
  rather than `#ffd700`, and the named `--z-*` scale rather than raw z-indexes.
- **State classes** are `is-` prefixed (`is-open`, `is-hidden`, `is-selected`).
- **Modifiers** use `--` (`character-video--umbrella`, `terminal-line--gold`).
- **Content is data.** Adding a menu entry or a table prop means editing an
  array in `src/data/`, not writing markup.
- `.btn-reset` strips UA button styling, so controls can be real `<button>`
  elements without a visual change.

## Verification

```bash
npm run audit:refs     # static: every getElementById target is rendered
npm run audit:render   # executes the component tree; checks ids + CSS coverage
npm run smoke          # drives the real page in Chrome (needs `npm run dev`)
```

`scripts/compare.mjs` screenshots this build and the original side by side.
It needs the original served from `public/`:

```bash
cp reference/index.original.html public/__original.html
node scripts/compare.mjs
rm public/__original.html
```

`smoke` and `compare` use `playwright-core`, which drives the Chrome already
installed on the machine — no browser download.

## Known issues (pre-existing, preserved deliberately)

- **The game/video modal system is currently unused.** `VideoModal.js`,
  `GameModal.js` and `DesktopOnlyNotice.js` are still rendered and initialised
  from `main.js`, but nothing calls `openVideoModal()` / `openGameModal()` /
  `showDesktopOnlyNotice()` any more — that only happened from the arcade
  cabinets (Street Fighter II, Centipede), which were removed when the Arcade
  Hall section's background switched to a beach/sandcastle scene. The overlay
  code was left in place as generic, reusable infrastructure rather than
  deleted, since another section could plausibly want a fullscreen
  video/game trigger later.
- **Two preloaded images are never displayed** —
  `photo_2026-04-09_20-54-06.jpg` and `photo_2026-04-10_23-09-28.jpg` are in the
  loading manifest only. They are cheap (3 KB each) and removing them would
  change the progress bar's step count, so they were left alone.
