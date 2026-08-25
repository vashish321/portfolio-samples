# Sam Wolff — five website concepts

Five complete, self-contained website designs for a visual artist working across
drawing, comics, painting and printmaking. Each one is a different design
direction for the same content, so they can be compared side by side.

Open **`index.html`** in this folder for a browsable index of all five.

| Folder | Name | Direction |
|---|---|---|
| `samwolff1/` | Atelier | Gallery minimal — museum white, serif display type, asymmetric grid |
| `samwolff2/` | Panels | Comic book — halftone paper, hard rules, panels and speech bubbles |
| `samwolff3/` | Ink & Paper | Editorial broadsheet — masthead, drop caps, three-column essay, plate index |
| `samwolff4/` | Nocturne | Dark studio — full-bleed hero, brass accents, hover-preview index |
| `samwolff5/` | Riso Zine | Playful print — risograph colour, stickers, rotated cards |

## What each sample contains

Every sample is a four-page site:

- `index.html` — home page with hero, selected work and an introduction to the practice
- `work.html` — full catalogue of twelve works with medium filters and a lightbox viewer
- `about.html` — biography, method, exhibition history and book list
- `contact.html` — enquiry form, studio details and terms

Plus `style.css`, an `img/` folder of artwork, and a `fonts/` folder.

## How it's built

- **Static HTML and CSS.** No build step, no framework, no JavaScript dependencies.
  Roughly 60 lines of vanilla JS per site handles the lightbox, filters, mobile
  nav and scroll reveals — everything still works with JavaScript disabled, apart
  from those enhancements.
- **No third-party requests.** Fonts are bundled as `woff2` files
  (see `fonts/LICENSES.txt` — all open-source, SIL Open Font License) and all
  artwork is SVG stored in the repo. Nothing calls out to a CDN, so the sites
  load identically anywhere they're hosted and set no third-party cookies.
- **The contact forms work without a backend.** Submitting composes a message in
  the visitor's own email client. To switch to a hosted form service (Formspree,
  Basin, Netlify Forms), give the `<form>` an `action` and `method="POST"` and
  delete the submit handler in the inline `<script>`.
- **Accessibility.** Skip links, visible focus rings, `aria-current` on the
  active nav item, a keyboard-navigable lightbox (arrow keys and `Esc`),
  labelled form fields, and `prefers-reduced-motion` support throughout.
- **Responsive** from 320px upwards; verified with no horizontal overflow at
  375px and 1440px on all 21 pages.

## Replacing the placeholder artwork

The artwork is generated SVG standing in for real work. To swap in scans or
photographs, drop your files into a sample's `img/` folder and update the
references. Each work appears in three places per site: the `<img src>`, the
`data-src` used by the lightbox, and occasionally a feature image on the home,
about or contact page. Grep for the slug (for example `nightwatch`) to find
every reference.

Images are displayed with `object-fit: cover` in a 4:5 frame on most cards, so
portrait-oriented files crop most gracefully.

## Changing the content

All twelve works, along with their titles, years, media and categories, are
defined once per site in the HTML. Names, exhibition entries, book titles, the
studio address and the email address (`studio@samwolff.example`) are placeholder
content and should be replaced before any of these goes live.

## Deploying

These pages are static, so any host will serve them. On GitHub Pages, enable
Pages for the repository and the sites are available at
`/<repo>/sam%20wolff/samwolff1/` and so on. Because the folder name contains a
space, links to it are URL-encoded as `sam%20wolff`; renaming the folder to
`sam-wolff` removes that if you'd prefer cleaner URLs.

---

Placeholder notice: Sam Wolff is a fictional artist created for these samples.
The artwork, biography, exhibition history and press mentions are invented and
should not be presented as a real record.
