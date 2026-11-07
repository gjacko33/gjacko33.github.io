# DESIGN.md: Gilang Jecko Portfolio

This file describes the design system behind https://gjacko33.github.io/, a one-page portfolio built from static HTML, CSS and JS. It is meant for anyone adding a section or a component, whether a person or an AI agent. Every value here comes from `design-tokens.css` and `styles.css`. If a value changes in the code, update it here too.

## 1. Look and feel

- **Dark and deep.** The page fades from charcoal at the top to near-black, with a faint film grain over everything. There are no light sections.
- **Glass, lit teal to violet.** Accents look like dark glass lit from inside: teal `#7ff3dc`, blue `#63c9ff`, indigo `#6f86ff` and violet `#a07cff`. The accent only appears in small amounts, such as one serif word per heading, the button glow, dots and numbers.
- **Big grotesk, one serif word.** Headings use tight Space Grotesk. One word per heading switches to Instrument Serif italic and gets the glass treatment.
- **Brand colour belongs to the work.** Sections that show client work (Websites, Email, Graphics) take each client's colour from a `--tone` or `--brand` variable. The portfolio's own chrome stays neutral.
- **Quiet until touched.** Buttons rest as plain glass. Glow, rims and reveals appear on hover, on focus, or as a section scrolls in.

## 2. Colour

### Surfaces

| Token | Value | Use |
|---|---|---|
| `--bg` | `radial-gradient(120% 80% at 50% 0%, #2b2b30 0%, #121214 45%, #060607 100%)` | Page background, fixed |
| `--bg-base` | `#060607` | Fallback under `--bg`, and the base for brand tints |
| `--card` | `linear-gradient(145deg, #34343a 0%, #1c1c20 45%, #0c0c0e 100%)` | Raised cards (`.card`) |
| `--placeholder` | `linear-gradient(160deg, #3a3a41 0%, #1a1a1e 60%, #101012 100%)` | Empty image slots |
| Story card | `linear-gradient(145deg,#1c1c20 0%,#121215 60%,#0e0e10 100%)` | `.project-card` |
| Showcase stage | `linear-gradient(180deg,#09090b,#121215)` | Under the Websites and Email scenes |
| Glass panel | `linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.015))` | Contact panel, pills, ghost surfaces |

A film-grain SVG noise sits over the whole page at 16% opacity (`body::before`).

### Accent (glass palette)

| Token | Value | Use |
|---|---|---|
| `--accent` | `linear-gradient(110deg, #7ff3dc 0%, #63c9ff 34%, #6f86ff 66%, #a07cff 100%)` | Full accent gradient |
| `--accent-strong` | `#7ff3dc` | Small solid accents: arrows, counters, kicker text |
| `--accent-glow` | `#63c9ff` | Status dots and glows |
| `--accent-soft` | `linear-gradient(135deg, rgba(127,243,220,.12) 0%, rgba(99,201,255,.1) 45%, rgba(126,112,255,.14) 100%)` | Hover and active fills on pills and tiles |
| `--glass-tint` | `linear-gradient(90deg, #6fc9b8 0%, #6aaec4 38%, #7d8ae0 72%, #7a68ea 100%)` | Thin bars, such as the stat progress |
| `--highlight` | Dark glass `#24344d → #121a30`, lit by teal and violet radials with a white specular streak | Fill for the serif highlight word |
| `--glass-rim` | `rgba(232,240,255,.62)` | Text stroke on the highlight word |
| `--orb` | Radial: `#7ff3dc → #63c9ff → #7e70ff → #1f2470` | Hero and contact glow orbs (blurred, about 30% opacity) |

### Text

| Token | Value | Use |
|---|---|---|
| `--ink` | `#f7f6f8` | Headings and primary text |
| `--text-body` | `#c4c4cb` | Body copy |
| `--text-grey` | `#9a9aa3` | Supporting copy under headings |
| `--text-muted` | `#6f6f78` | Least important text |
| `--muted` | `#a2a0aa` | Secondary labels |
| `--line` | `rgba(255,255,255,.13)` | Dividers and table rules |

Small uppercase labels use greys between `#88858f` and `#a6a3ad`.

### Brand tones (client sections only)

Websites and Email scenes set `--tone`, and Graphics panels set `--brand`. The CSS mixes these into glows (`color-mix(in srgb, var(--tone) 62%, transparent)`), panel backgrounds (`--brand` at 18% over `#060607`) and the glass edge of artwork cards (`--glint`, which is `--brand` at 55% mixed with white).

| Brand | Websites / Email `--tone` | Graphics `--brand` |
|---|---|---|
| Continue Peptides | — | `#b8562a` |
| Supps247 | `#1f8fe0` | `#1f6fb2` |
| MKP Bikes | `#8d939b` (Email) | `#4a4a52` |
| Milkyano | — | `#2d3f6b` |
| Steroids | `#f2b705` | `#c99700` |
| HugGooling | `#f2c230` (Websites), `#d29d14` (Email) | `#d29d14` |
| iilumo | `#d9a21b` | `#c98d00` |
| Licensed Baddie | — | `#8a2a5a` |

The other sites in the Websites list each carry their own `--tone` on their `.site-scene`.

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Sans (`--font-sans`) | Space Grotesk 300, 400, 500, 600 | Everything except accent words |
| Serif (`--font-serif`) | Instrument Serif, italic only | One accent word per heading, never body copy |
| Client lockups | Inter Tight, Plus Jakarta Sans, Urbanist, Inter, Montserrat, Poppins | Loaded with a `text=` subset and only used inside client logos and reels |

### Scale

| Element | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Hero name `h1` | `clamp(84px, min(16vw,23vh), 220px)` | 600 | .72 | -.105em |
| Display heading (`.display-heading`) | `clamp(50px, 8vw, 106px)` | 500 | .95 | -.075em |
| Contact heading | `clamp(57px, 10vw, 112px)` | 500 | .83 | -.08em |
| Story dialog heading | `clamp(48px, 7vw, 96px)` | 500 | .9 | -.07em |
| Brand strip heading | `clamp(40px, 5.6vw, 72px)` | 500 | .95 | -.065em |
| Story card title | `clamp(40px, 4.6vw, 64px)` | 500 | .92 | -.07em |
| Website row name | `clamp(26px, 2.8vw, 40px)` | 500 | 1.05 | -.05em |
| Hero intro | `clamp(16px, 1.5vw, 20px)` | 400 | 1.55 | — |
| Body | 15 to 16px | 400 | 1.7 to 1.8 | — |
| Supporting copy | 14px | 400 | 1.7 | — |
| Labels (uppercase) | 9 to 11px | 500 | — | .13em |

Rules:
- Big headings use negative tracking and line heights under 1. Lines are meant to touch.
- Numbers in counters and stats use `font-variant-numeric: tabular-nums`.
- Labels are uppercase and spaced, with counts written like `13 SITES`, `04 BRANDS` and `STORY 01`.
- Body copy stays at 60 to 62ch or less.

### The highlight word

One word per heading is wrapped in `<em>`. It gets:
1. Instrument Serif italic.
2. `--highlight` clipped to the text as its fill.
3. A `.018em` stroke in `--glass-rim`.
4. Stacked drop shadows for the bevel and a blue glow at `rgba(99,170,255,.28)`.
5. Negative side margins with matching padding, so the italic overhang does not get clipped.

Use it on one word only, for example "Websites I've *designed.*" or "Graphic *playground.*"

## 4. Layout and spacing

| Token | Value |
|---|---|
| `--max-width` | `1240px` |
| `--gutter` | `clamp(16px, 4vw, 56px)` |
| `--section-pad` | `clamp(72px, 10vw, 140px)` top padding per section (82px at 640px and below) |

- Content sits in `.section-wrap`: `width: min(100% - 2 * var(--gutter), var(--max-width))`, centred.
- Section heading row (`.work-heading`): heading and supporting copy on the left, an uppercase count on the right, aligned to the bottom. It stacks below 640px.
- Grids use `minmax(0, 1fr)` so long content never forces overflow.
- `.site-shell` uses `overflow-x: clip`, not `hidden`, so sticky elements keep working.
- Section order: Header → Hero → About → Experience → Brands I've worked with → Selected stories (Work) → Websites → Email → Graphics → Contact → Footer.

### Breakpoints

| Query | Changes |
|---|---|
| `max-width: 900px` | Two-column layouts stack, and story cards show the 16:9 cover. Websites switches to a sticky 4:3 showcase driven by the row in the middle of the screen. Email stacks the phone above the list. |
| `max-width: 640px` | Nav collapses into a menu button and dropdown. Headings stack. Graphics becomes a horizontal swipe rail (`scroll-snap`). |
| `min-width: 641px` and `max-height: 700px` | Story cards stop pinning and grow with their content. |
| `hover: none` | Live blur is removed (see Performance). |
| `prefers-reduced-motion: reduce` | Animations and transitions are close to off, and the intro is skipped. |

## 5. Shape and depth

| Token | Value | Use |
|---|---|---|
| `--r-card` | `22px` | Cards, the Email stage |
| `--r-image` | `16px` | Images |
| `--r-pill` | `999px` | Buttons, pills, nav bar |
| Story card | `28px` | `.project-card` |
| Contact panel | `30px` | `.contact-panel` |
| Websites stage | `26px` | `.site-stage` |
| Artwork card | `14px` (`18px` when raised) | `.gfx-card` |

| Token | Value | Use |
|---|---|---|
| `--edge` | `inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.6)` | Bevel on raised surfaces |
| `--lift` | `0 30px 60px -20px rgba(0,0,0,.8), 0 10px 20px -10px rgba(0,0,0,.6)` | Drop shadow on raised surfaces |

Borders are white at low opacity: `.08` for faint, `.12` to `.14` for standard, `.2` for buttons. Hover borders shift to `rgba(143,180,212,.42–.6)`.

## 6. Components

### Header
A sticky pill bar 12px from the top, 60px tall, with a 12% white border, `rgba(10,10,12,.78)` fill and a 20px backdrop blur on desktop. It has three columns: the GJ mark, the nav (12px, `#d1cfd5`, white on hover) and the "Let's talk" button. At 640px and below the nav becomes a dropdown panel with a 20px radius.

### Buttons (`.button`, `.header-cta`, `.story-open`, `.story-link`)
- At rest: a pill at least 46px tall with a 20% white border, a faint glass gradient fill, 12px text, and an optional 16px line icon (1.7 stroke).
- On hover or focus: a glass layer fades in. A teal-to-violet glow slides in from the left (`--glow-x` 20% → 102%), and a conic iridescent rim turns slowly (`--rim`, 6s per loop). The button also lifts 2px.
- With reduced motion, the rim stops turning and the layer only fades.

### Pills and chips
Pills are 999px wide with a 12 to 17% white border, filled with `--accent-soft` or nearly transparent, using 10 to 12px text in `#b3c9df` or `#c9c6cf`. Use them for country lists, the Graphics jump index, website status (`Live ↗`, `Concept`, `Figma design`, `Coming soon`) and email tabs. A selected email tab takes its card's `--tone`: border at 60% and fill at 16%.

### Story card (`.project-card`)
- Desktop: two columns, cover and info, alternating sides on each card.
- Height is `min(600px, 100svh - 150px)`. Cards pin under the header at `96px + i × 14px`. As the next card slides over, `--stack` (0 to 1) shrinks the card below by up to 5% and darkens it by up to 45%.
- The cover is a muted looping video: a 6:5 cut on desktop and 16:9 at 900px and below.
- The info column has meta labels, a title with a highlight word, a pitch of up to 34ch, a facts table (`Role / Industry / Delivered`) and a "Read the story →" button that opens the story dialog.

### Story dialog
Up to 1080px wide with a 28px radius on `#0d0d10`, a blurred backdrop and a sticky top bar. Sections are laid out as a 170px label column next to the content: Overview, The challenge (numbered cards), The process (numbered steps), The solution, and Outcome. Numbers use `--accent-strong` in two-digit `decimal-leading-zero` format.

### Websites showcase
- Left: a numbered list (number, name, kind, status). Hovering or focusing a row switches the scene.
- Right: a 4:5 stage holding a 3D scene. It shows a large faded wordmark, a desktop browser tilted `rotateY(-27deg) rotateX(13deg) rotateZ(5deg)` and a phone tilted `rotateY(24deg) rotateX(10deg) rotateZ(-7deg)`, both lit by the site's `--tone`.
- The devices stay still and only the page inside scrolls (`site-scroll`, alternating, `--scroll` seconds). Desktop and phone share the same duration.

### Email showcase
- Two columns: one phone on the left (5fr), the brand list on the right (6fr). Below 900px they stack, phone first.
- The phone is pure CSS: a 9:19.5 frame with a dynamic island, side buttons and a status bar (time and battery). Sizes use `cqw` from `.mail-device`, so the whole phone scales from one height.
- It sits on a stage with two soft radial glows in the open brand's `--mail-tone`. The variable is registered with `@property`, so the glow fades between brands over 1.2s instead of jumping.
- The list is an accordion with one brand open at a time. Each brand head shows its logo and email count. HugGooling and Supps247 logos stay grey until opened; MKP and iilumo stay white.
- Picking an email fades the screen out, swaps the image once it has decoded, and restarts the `site-scroll` animation from the header. Tapping the phone opens the full email in the lightbox at 600px wide.

### Graphics panels
- Each brand panel is a full-width band tinted with `--brand`, with a blurred brand glow behind it.
- In the centre is a CSS phone (9:19, 46px radius) playing a looping story reel rebuilt from Figma layers.
- Artwork cards (4:5) sit on both sides with a brand-tinted glass edge. Clicking one opens the zoom lightbox.
- At 640px and below, the phone stays fixed and the artwork scrolls in a swipe rail.

### Lightbox
A full-screen dialog over `rgba(4,4,6,.88)` with a 10px blur. Artwork fits the screen and can be zoomed from 100% to 180% and panned. Long emails use `is-tall`: they fit the width (up to 600px) and scroll.

### Client wall
Two rows of logo tiles (190 × 96, 18px radius) scroll in opposite directions (42s and 48s) and pause on hover. Logos are shown as white silhouettes (`brightness(0) invert(1)`), or kept tonal with `.is-tonal`.

## 7. Motion

| Pattern | Spec |
|---|---|
| Standard easing (`--ease`) | `cubic-bezier(.2,.7,.25,1)` |
| Scroll reveal (`.will-reveal`) | From opacity 0, 10px blur and 42px down (media: 64px down, scale .96) to rest. Opacity and blur take .9s and the transform takes 1.1s, staggered with `--reveal-delay`. |
| Intro (once per session) | The GJ mark draws in (1.5s), the accent line fills, then a feathered mask lifts the curtain. Repeat visits in the same session skip it (`sessionStorage` key `gj-intro`, `.no-intro` class). |
| Hero entrance | `hero-in`, 1.2s, staggered about 80ms per line |
| Hero portrait | A soft circle (110 to 160px) follows the cursor or finger and reveals an alternate portrait underneath |
| Hover lift | 2px for buttons, 6px for the email phone |
| Page scroll in devices | `site-scroll`: holds the top for 8%, eases to the bottom, holds, then reverses |
| Story reels | Loops of 6 to 11s built from `reel-io` and per-brand keyframes |

Rules:
- Nothing moves while it is off screen. `.is-offscreen` pauses every animation in a section.
- Device mockups never float or tilt-animate. Only their content moves.
- Every animation needs a still resting state that reads as the finished design, because that is what reduced motion shows.

## 8. Images and media

- Format: WebP for images, and MP4 (muted, `playsinline`, `loop`) with a WebP poster for covers.
- Every image sets `width` and `height`. Anything below the fold uses `loading="lazy"` and `decoding="async"`.
- Small copies go in cards and the full size loads on demand: gallery `thumbs/` at 480px with `data-full`, website `-m-sm` and `thumbs/` copies on small screens, and email `-sm` at 420px with the full 900px version in the lightbox.
- Story reel layers stay at 540px wide or less.
- Showcase scenes load images only when shown (`data-src`) and release them again on small screens.
- Link thumbnail: `assets/og-image.jpg`, 1200 × 630, used by the Open Graph and Twitter tags. Its source is the frame "Link thumbnail 1200×630" in the Figma file Gilang's Creative (`5DpRZC6aPJoOVqUNQrvilU`, node `44:2`). Re-export it from there after changes.

## 9. Performance rules

These rules exist because iOS Safari crashed ("A problem repeatedly occurred") on earlier, heavier versions.

- No live blur on touch screens. Under `hover: none` the header has no backdrop blur, the glows have no `filter: blur`, the reel chips have no backdrop blur, and reveals don't blur.
- Graphics panels use `content-visibility: auto` with `contain-intrinsic-size: auto 1000px`.
- Cover videos play only while visible. On touch screens their `src` is removed when far away and restored on approach.
- Fonts: Space Grotesk (variable, 300–600) and Instrument Serif are self-hosted in `assets/fonts/` (latin and latin-ext woff2, `font-display:swap`), and the two hero files are preloaded, so first paint never waits on Google. The client wall's lockup fonts load asynchronously (`media="print" onload`) with `text=` subsets. The reel fonts sit in `data-fonts` on `#graphics` and only load once that section is 1500px away.
- Logos are stored at about 2.25× their largest display height. Heavy SVGs keep only the coordinate precision their size needs.
- Timers that only animate on screen (the About stat ticker, reels) skip their turns while off screen.
- After editing `styles.css` or `script.js`, bump the version query in `index.html` (`?v=`) so caches refresh.

## 10. Copy voice

- Short, plain and specific. Name the client, the deliverable and the real number. Don't invent stats.
- Headings follow a "[Thing] I've *designed.*" pattern with a full stop.
- Labels are uppercase counts and states, such as `13 SITES`, `STORY 02 · 2026` and `Coming soon`.
- Interface copy is in English.

## 11. Do and don't

| Do | Don't |
|---|---|
| Use a single serif highlight word per heading | Put serif or italic in body copy, or highlight two words |
| Let client colour come from `--tone` or `--brand` | Hard-code a client colour into shared chrome |
| Keep device mockups still and scroll their content | Float, bob or spin a device |
| Add new animated sections to the off-screen observer | Leave a loop running while it is off screen |
| Give each image width, height, lazy loading and a small copy | Ship full-size images into cards |
| Check 375px, 900px and 1440px widths, plus touch | Rely on blur or backdrop-filter on phones |
