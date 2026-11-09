# Jinglefest media

Posters, flyers, pamphlets and social posts for Jinglefest (thejinglefest.com). This is a copy of `marketing/` from the website repo, set up to work on its own.

```bash
bun gen.mjs gemini <scene>                                    # make or remake an illustration (or: grok)
bun render.mjs [poster|a5|<day>]                              # rebuild the Bake-Off poster, A5 flyer, posts
bun shot.mjs templates/<name>.html 1080 1350 out/<name>.jpg   # render any new piece
```

## Setup (Claude: do this first on a new computer)

Everything runs on **bun** alone. Node isn't needed. Most people won't have bun yet, so check and install it before anything else.

1. **Check:** `bun --version`. If that prints a version, skip to step 3.
2. **Install bun** (no admin rights needed):
   - macOS or Linux: `curl -fsSL https://bun.sh/install | bash`
   - Windows (PowerShell): `powershell -c "irm bun.sh/install.ps1 | iex"`

   The installer puts bun in `~/.bun/bin` and adds it to the shell profile, but the current terminal won't see it yet. Open a new terminal, or run `export PATH="$HOME/.bun/bin:$PATH"` (macOS/Linux), then check `bun --version` again. If `curl` is missing on Linux, install it with the system package manager first. On a Mac where Homebrew is already set up, `brew install oven-sh/bun/bun` also works.
3. **Install the packages:** in this folder, run `bun install`.
4. **Install the browser that renders the pages:** `bunx playwright install chromium`. This is a one-time download of about 150 MB. Without it, every render fails with "Executable doesn't exist".
5. **Check it all works:** `bun shot.mjs templates/starter.html 1080 1350 out/check.jpg`, then open `out/check.jpg`. It should show the starter post with the logo, the headline, the kids and a QR code.
6. **Only for making new illustrations:** set `GEMINI_API_KEY` (from Google AI Studio) or `XAI_API_KEY` (from xAI) in the terminal, such as `export GEMINI_API_KEY=...`. Ask the owner for a key. Never write it into a file in this folder. You don't need a key to render pieces from existing art.

## Instructions for Claude

Follow these rules for every new file.

### 1. AI makes parts, never the finished piece

- Use **Gemini** (`bun gen.mjs gemini ...`, needs `GEMINI_API_KEY`) or **Grok** (`bun gen.mjs grok ...`, needs `XAI_API_KEY`) **only for illustration parts**: a scene, a character group, an object or a background.
- **Never ask Gemini (or Grok) for a whole poster, flyer or post.** Never ask it for text, logos, dates, prices, phone numbers, QR codes or layout. Image models misspell words and invent numbers.
- Every prompt starts with `STYLE` from `art.mjs`, which already bans text and sets the palette. Add the new scene to `art` in `art.mjs` with a short name, then run `gen.mjs` with that name. Results land in `art/<name>-4x5.png` and `art/<name>-9x16.png` (set `ratios` for other shapes).
- Say where the empty space goes ("keep the top 58% as plain sunburst"), so the words have somewhere to sit.
- **Check every image before using it.** Open it and look for stray letters on signs, clothes, awnings and clock faces, borders, extra fingers, and skin tone (the brief asks for warm medium tan, not yellow or orange). `bun scan-text.mjs` asks Gemini to look for stray lettering across `art/`. If anything's wrong, run it again. Never fix text in an image by asking the model to "remove" it.
- To use characters at any size, cut them off their background (`cutout.mjs` shows how for the poster kids → `art/poster-kids.png`).
- The Grok path hasn't been run against the live API yet. Check the first image it makes before running a batch. If xAI rejects the request, check the current model name and fields at docs.x.ai and fix `providers.grok` in `gen.mjs`.

### 2. Build the final piece in HTML

1. Copy `templates/starter.html` to `templates/<name>.html`. For a variant of an existing piece, extend the matching function in `render.mjs` instead (`posterHtml`, `a5Html`, `postHtml`).
2. Set the page size (table below) and place the AI illustration as an `<img>`.
3. Add everything else as real HTML and assets from this folder: the logo (CSS text in the brand font, or an SVG from `01-logo`), headline, details, stickers, the QR code SVG, footer, sponsor logo.
4. Render it with `bun shot.mjs` (or `render.mjs`), then **open the output and look at it**. Check that nothing touches or overlaps, that text fits, and that faces aren't covered.

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
| Bake-Off poster | `07-poster/little-chefs-bake-off-poster.{png,pdf}` | `bun render.mjs poster` |
| Bake-Off A5 flyer | `07-poster/little-chefs-bake-off-a5{.png,-print.pdf,-print-with-bleed.pdf}` | `bun render.mjs a5`. RGB only, so check with the print shop if they need CMYK |
| 10-day Bake-Off posts | `08-socials/feed-4x5/`, `story-9x16/`, `captions.md` | Words in `posts.mjs`. `bun render.mjs <day>`. Days 1–4 show the early bird price, which has ended |
| Band Battle feed post | `08-socials/feed-4x5/band-battle-band.png` | 1080 × 1350, words in `bandPost` in `posts.mjs`. `bun render.mjs band` |
| Starter template | `templates/starter.html` | Fonts, colours, logo, coupon, QR, footer |
| Website icons | `10-website/favicon.svg`, `apple-touch-icon.png` (180 × 180) | Copies of the live site's icons |
| Link previews | `10-website/share-images/og-{home,bakeoff,music,stalls,carnival,sponsors}.jpg` (1200 × 630), `bread-and-brew.jpg` | The pictures WhatsApp and Facebook show when a page is shared. The live copies are in the website repo's `public/img`: change them there too |

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
