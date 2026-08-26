# Sam Wolff — five site directions

Five working websites for one artist. They share a single body of work — 30
pieces across comics, paintings, drawings and risograph editions, plus 3 books
with every page readable — and differ in **architecture** rather than paint:
how you find things, what the site expects you to do, and what it optimises for.

Open **`index.html`** in this folder to compare them side by side.

| Folder | Name | Flow | What it is |
|---|---|---|---|
| `samwolff1/` | The Vault | filter → sort → inspect | Faceted archive application |
| `samwolff2/` | Newsstand | browse the rack → read the book | Newsprint front page with a full comic reader |
| `samwolff3/` | The Walk | walk the rooms → read the label | Six-room horizontal gallery with wall labels |
| `samwolff4/` | Studio Journal | scan the years → filter → compare | Dated timeline with drag-to-compare sliders |
| `samwolff5/` | Editions | browse → configure → order | Shop with variants and a persistent basket |

Each site is three pages: its signature experience, a studio/about page, and a
contact page — all in that site's own idiom.

## What makes them different

**The Vault** — a sticky facet rail (medium, series, year, availability) with
live counts, a search field bound to `/`, five sort orders and three view
densities (gallery grid, data list, contact sheet). Works open in a slide-over
with a spec table, related pieces and prev/next. Books appear as inline page
strips you can read.
*Archivo + IBM Plex Mono, bone white and signal red.*

**Newsstand** — a halftone-paper front page over a genuine comic reader. Any
issue opens full-screen with single or spread view, a thumbnail rail, a page
slider, swipe and keyboard control (`←` `→` `Home` `End`, `R` to open the latest).
Paintings, drawings and prints sit behind tabs as back matter.
*Bangers + Libre Franklin, newsprint cream and spot red.*

**The Walk** — six rooms scrolled sideways with CSS scroll-snap, mouse-wheel
translation and a progress rail. Each room is hung for its medium: a salon wall
of drawings, a plinth of books over a wall of pages, a print rack. Clicking a
work raises a museum wall label; an eight-stop guided tour walks you through.
Falls back to vertical scrolling under 900px.
*Cormorant Garamond + Jost, plaster, deep green and brass.*

**Studio Journal** — twenty dated entries (sketch, process, finished, print day,
show, note) down a timeline, with a sticky year rail driven by scrollspy,
entry-type filters, and drag-to-compare sliders that wipe from underdrawing to
finished canvas. A full work index by medium sits below.
*Sora + Newsreader, near-black and amber.*

**Editions** — 33 items across prints, books, drawings, paintings and original
comic pages. Quick view handles size and framing variants with live pricing;
the basket persists in `localStorage` across reloads; checkout composes an
itemised email rather than taking card details.
*Outfit + Manrope, risograph brights on off-white.*

## How it's built

- **Static HTML and CSS.** No build step, no framework, no dependencies. Each
  site carries its own vanilla JavaScript for its signature interaction.
- **No third-party requests.** Fonts are bundled as `woff2`
  (see any site's `fonts/LICENSES.txt` — all open-source, SIL Open Font License)
  and every image is SVG generated for that site's palette. Nothing calls a CDN,
  so no third-party cookies and identical loading anywhere it's hosted.
- **Contact forms work without a backend.** Submitting composes a message in the
  visitor's own email client. To use a hosted form service instead, give the
  `<form>` an `action` and `method="POST"` and remove the submit handler in the
  inline `<script>`.
- **Accessibility.** Skip links, visible focus rings, `aria-current` on active
  navigation, keyboard paths through every interaction (readers, drawers,
  lightboxes, the gallery walk), labelled form fields, live regions on status
  messages, and `prefers-reduced-motion` honoured throughout.
- **Responsive**, verified with no horizontal overflow at 375px and 1440px on
  all 16 pages.

## Replacing the placeholder artwork

Every image is an SVG in each site's `img/` folder, named by slug
(`undertow.svg`, `nightwatch.svg`, `hollow-kings-p04.svg`, …). Drop replacements
in with the same filenames and nothing else needs to change. Most frames use
`object-fit: cover` at 4:5, so portrait-oriented files crop most gracefully;
comic pages are 3:4.

## Changing the content

Titles, media, dimensions, prices, availability, journal entries, exhibitions
and book details are written into the HTML of each site. The artist name,
exhibition history, prices and the address `studio@samwolff.example` are all
placeholder.

## Deploying

Static, so any host serves them. On GitHub Pages they are available at
`/<repo>/sam%20wolff/samwolff1/` and so on. The folder name contains a space, so
links to it are URL-encoded as `sam%20wolff`; renaming the folder to `sam-wolff`
removes that.

---

**Placeholder notice:** Sam Wolff is a fictional artist created for these
samples. The artwork, biography, exhibition history, prices and press mentions
are invented and should not be presented as a real record.
