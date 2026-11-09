# Jinglefest media

Posters, flyers, pamphlets and social posts for Jinglefest (thejinglefest.com). This is a copy of `marketing/` from the website repo, set up to work on its own.

```bash
bun install                                             # once: Playwright, qrcode, opentype.js
node gen.mjs gemini <scene>                             # make or remake an illustration (or: grok)
node render.mjs [poster|a5|<day>]                       # rebuild the Bake-Off poster, A5 flyer, posts
node shot.mjs templates/<name>.html 1080 1350 out/<name>.jpg   # render any new piece
```

## Instructions for Claude

Follow these rules for every new file.

### 1. AI makes parts, never the finished piece

- Use **Gemini** (`node gen.mjs gemini ...`, needs `GEMINI_API_KEY`) or **Grok** (`node gen.mjs grok ...`, needs `XAI_API_KEY`) **only for illustration parts**: a scene, a character group, an object or a background.
- **Never ask Gemini (or Grok) for a whole poster, flyer or post.** Never ask it for text, logos, dates, prices, phone numbers, QR codes or layout. Image models misspell words and invent numbers.
- Every prompt starts with `STYLE` from `art.mjs`, which already bans text and sets the palette. Add the new scene to `art` in `art.mjs` with a short name, then run `gen.mjs` with that name. Results land in `art/<name>-4x5.png` and `art/<name>-9x16.png` (set `ratios` for other shapes).
- Say where the empty space goes ("keep the top 58% as plain sunburst"), so the words have somewhere to sit.
- **Check every image before using it.** Open it and look for stray letters on signs, clothes, awnings and clock faces, borders, extra fingers, and skin tone (the brief asks for warm medium tan, not yellow or orange). `node scan-text.mjs` asks Gemini to look for stray lettering across `art/`. If anything's wrong, run it again. Never fix text in an image by asking the model to "remove" it.
- To use characters at any size, cut them off their background (`cutout.mjs` shows how for the poster kids → `art/poster-kids.png`).
- The Grok path hasn't been run against the live API yet. Check the first image it makes before running a batch. If xAI rejects the request, check the current model name and fields at docs.x.ai and fix `providers.grok` in `gen.mjs`.

### 2. Build the final piece in HTML

1. Copy `templates/starter.html` to `templates/<name>.html`. For a variant of an existing piece, extend the matching function in `render.mjs` instead (`posterHtml`, `a5Html`, `postHtml`).
2. Set the page size (table below) and place the AI illustration as an `<img>`.
3. Add everything else as real HTML and assets from this folder: the logo (CSS text in the brand font, or an SVG from `01-logo`), headline, details, stickers, the QR code SVG, footer, sponsor logo.
4. Render it with `node shot.mjs` (or `render.mjs`), then **open the output and look at it**. Check that nothing touches or overlaps, that text fits, and that faces aren't covered.

| Piece | HTML size (px) | Render |
|---|---|---|
| Instagram/WhatsApp feed post | 1080 × 1350 | `shot.mjs … 1080 1350 out/x.jpg` |
| Story / status | 1080 × 1920 (keep the top 220 and bottom 340 clear) | `shot.mjs … 1080 1920 out/x.jpg` |
| Square | 1080 × 1080 | `shot.mjs … 1080 1080 out/x.jpg` |
| Poster (screen, sharing) | 1280 × 1600 | `shot.mjs … 1280 1600 out/x.png 2` |
| A5 print flyer | 1332 × 1868 (148 × 210 mm + 3 mm bleed, 26 px = 3 mm) | see `a5()` in `render.mjs`: 600 dpi PNG + PDFs with and without bleed |
| A4 print | 1806 × 2556 (210 × 297 mm + 3 mm bleed, 26 px = 3 mm) | scale `4961/1806` for 600 dpi |
| Pamphlet (A4 folded to A5) | two A5 pages per side, one HTML file per page | print PDFs page by page, then join them |

For print, keep text and QR codes at least 5 mm (about 44 px) inside the trim. Test that the QR code scans from the final print file.

### 3. Words and facts

- All wording lives in the HTML or in `posts.mjs`, never in an image.
- Use only facts from the **Approved facts** list below. If something isn't there (prizes, a stall price, a venue or time for the carnival), ask before printing it. Don't make up claims.
- Keep internal matters off anything public: money, undecided ideas, team discussion.
- Write plainly. No "ultimate", "unforgettable" or "magical".
- Phone numbers go on posters and social images only. The website uses contact@thejinglefest.com.

### 4. When it's done

Put finished files in the right `jinglefest-media-kit/` folder (`07-poster`, `08-socials`, or a new numbered folder such as `10-pamphlets`), add them to the index below, and update `jinglefest-media-kit/README.md`. Scratch renders go in `out/`, which is ignored.

## Asset index

### Brand

| What | Where | Notes |
|---|---|---|
| Logo, outlined SVG | `jinglefest-media-kit/01-logo/jinglefest-logo-{cream,gold,ink,red}.svg` | No font needed. Tilted −6°, big J and T |
| Logo, transparent PNG | `01-logo/jinglefest-logo-*.png`, `jinglefest-logo-neon-{cream,gold}.png` | Neon versions go on dark or busy backgrounds |
| Logo as live text | `.logo` class in `render.mjs` / `templates/starter.html` | `<span class="logo"><i>J</i>inglefes<u>T</u></span>` |
| Bread & Brew logo | `01-logo/bread-and-brew-logo.svg`, `art/bread-and-brew-logo.svg` | Sponsor. Line: "Made possible by Bread & Brew". The JPG is low-res: ask Bread & Brew for the original before printing large |
| Colours | `02-colours/palette.png`, `palette.txt` | Santa Red `#E5142B` · Marigold `#FFBF1F` · Hot Pink `#FF2E7E` · Pine `#0B5A43` · Mint `#38E0AC` · Night `#1A0D3A` · Cream `#FFF3D6` · Ink `#1B0F12` · Paper `#FFFAF0` |
| Fonts | `03-fonts/` | **Cinzel Decorative** logo only · **Anton** headlines, uppercase · **Bricolage Grotesque** body · **Shrikhand** occasional script accents. All OFL |
| Brand guide | `JINGLEFEST-BRAND-GUIDE.pdf` (built by `guide.mjs`) | Look, logo, colours, fonts, Canva steps, approved facts, pre-post checklist |
| Style | `STYLE` in `art.mjs` | Sticker illustration, thick ink outlines, cream sticker edge, hard offset shadows, sunbursts, coupons with dashed inner borders |

### Pictures and pieces

| What | Where | Notes |
|---|---|---|
| Raw AI illustrations (PNG, full size) | `art/<scene>-4x5.png`, `art/<scene>-9x16.png` | Scenes: bakers, band, cookies, dough, finals, gift, judged, kit, lastcall, share, stage, stalls, today. Top ~58% left empty for words |
| Poster kids cut-out | `art/poster-kids.png` | Transparent. From `art/poster-4x5.png` via `cutout.mjs` |
| Scenes as JPG (shareable) | `04-backgrounds/scenes-feed-4x5/`, `scenes-story-9x16/` | Same scenes, smaller |
| Plain sunbursts | `04-backgrounds/sunbursts/sunburst-{red,gold,pink,mint,pine,night}-{square,feed,story,wide}-*.jpg` | Or draw them in CSS: `repeating-conic-gradient` (see `posterHtml`) |
| Textures | `04-backgrounds/textures/candy-stripe.jpg`, `halftone-dots-transparent.png` | |
| Stickers (SVG) | `05-stickers/` | bell, candy, cookie, cupcake, gift, ginger, guitar, mic, star, whisk; starbursts in gold, mint, pink, red. Drawn from `sources/Art.astro` |
| Layout guides | `06-templates/layout-guide-{feed,story}.png` | Text and safe zones |
| Prompt guide for people | `06-templates/gemini-prompts.md` | For volunteers using the Gemini app |
| QR codes | `09-qr-codes/qr-{website,bake-off,band-battle,stalls}.{svg,png}` | Use the SVG in HTML. Rebuilt by `kit.mjs` |
| Bake-Off poster | `07-poster/little-chefs-bake-off-poster.{png,pdf}` | `node render.mjs poster` |
| Bake-Off A5 flyer | `07-poster/little-chefs-bake-off-a5{.png,-print.pdf,-print-with-bleed.pdf}` | `node render.mjs a5`. RGB only, so check with the print shop if they need CMYK |
| 10-day Bake-Off posts | `08-socials/feed-4x5/`, `story-9x16/`, `captions.md` | Words in `posts.mjs`. `node render.mjs <day>`. Days 1–4 show the early bird price, which has ended |
| Starter template | `templates/starter.html` | Fonts, colours, logo, coupon, QR, footer |

### Scripts

| Script | Does |
|---|---|
| `art.mjs` | Style block and every scene prompt |
| `gen.mjs` | Makes illustrations with Gemini or Grok. Without names it only makes missing scenes |
| `scan-text.mjs` | Gemini looks for stray lettering in `art/` |
| `cutout.mjs` | Removes the sunburst behind the poster kids |
| `kit.mjs` | Rebuilds logos, stickers, sunbursts, swatches, QR codes |
| `guide.mjs` | Rebuilds the brand guide PDF and layout guides |
| `posts.mjs` | Words for the 10-day posts |
| `render.mjs` | Builds the poster, A5 flyer and the posts |
| `shot.mjs` | Renders any HTML page to PNG, JPG or PDF, and warns about images that didn't load or content past the edge |
| `sources/` | `og-home.jpg` (style reference sent to Gemini), `Art.astro` (sticker drawings from the website) |

## Approved facts

Checked against the website on 9 November 2026. If the website changes, update this list.

- **Website:** thejinglefest.com · email contact@thejinglefest.com
- **Phones (posters and social images only):** +91 80988 41307 / +91 9176040644
- **Little Chefs Bake-Off:** 14 November 2026, 4:30–6:30 PM, at Bread & Brew, Thailavaram Bus Stop, GST Road, Potheri. Ages 8–12 (2 decorated cookies) and 13–16 (1 cookie + 1 brownie or cake). Only 20 slots. Fee ₹749 (the ₹674 early bird ended on 8 November). Flour, sugar, butter, chocolate and salt provided. Bring your own tins and baking equipment. Judged on taste, decoration and creativity. One winner per age group gets a stall on carnival day, sponsored by Bread & Brew. Every child gets a gift bag. Made possible by Bread & Brew. Register at thejinglefest.com/kids/baking.
- **Christmas Carnival:** Sunday 6 December 2026. Venue and times aren't confirmed yet, so don't print them.
- **Band Battle:** 5 bands of 2–5 members. ₹350 a person + ₹550 a band. Screening 28 November, final at the carnival on 6 December. Register at thejinglefest.com/music.
- **Stalls:** 5 × 10 ft, 5 stalls available. Apply at thejinglefest.com/stalls. The price isn't confirmed yet.
- **2025:** 483 visitors, 12 stalls, 5 communities.

## Notes

- The website repo (`~/Workspace/jinglefest`) still has the original `marketing/` folder. This folder is now the one to work in.
- Never put API keys in this folder. Read them from the environment.
