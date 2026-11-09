// Renders any HTML page to an image or PDF, after its fonts and images have loaded.
// Usage: node shot.mjs <page.html> <width> <height> <out.png|out.jpg|out.pdf> [scale]
//   width and height are CSS pixels. scale multiplies them (2 for a sharp poster, 3638/1332 for A5 at 600 dpi).
//   A PDF comes out one page of exactly width x height.
import { chromium } from 'playwright';
import { resolve } from 'node:path';

const [page, w, h, out, scale = '1'] = process.argv.slice(2);
if (!page || !w || !h || !out) { console.log('Usage: node shot.mjs <page.html> <width> <height> <out> [scale]'); process.exit(1); }
const W = Number(w), H = Number(h);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: scale.split("/").map(Number).reduce((a, b) => a / b) });
const p = await ctx.newPage();
await p.goto(`file://${resolve(page)}`);
await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); });
await p.waitForTimeout(300);
const broken = await p.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')));
if (broken.length) console.log('WARNING: images that did not load:', broken.join(', '));
const spill = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight);
if (spill) console.log('WARNING: something runs past the edge of the page');
if (out.endsWith('.pdf')) {
  await p.addStyleTag({ content: `@page{size:${W}px ${H}px;margin:0}html,body{margin:0}` });
  await p.emulateMedia({ media: 'screen' });
  await p.pdf({ path: out, width: `${W}px`, height: `${H}px`, printBackground: true, pageRanges: '1' });
} else {
  await p.screenshot({ path: out, ...(out.endsWith('.jpg') ? { type: 'jpeg', quality: 93 } : {}) });
}
await b.close();
console.log('wrote', out);
