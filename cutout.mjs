// Lifts the kids off the poster art's sunburst so the poster can place them at any size.
// Flood-fills the flat pink and mint background from the edges, then crops. Run after gen.mjs.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
const dir = new URL('./art/', import.meta.url).pathname;
const src = `data:image/png;base64,${readFileSync(`${dir}poster-4x5.png`).toString('base64')}`;
const b = await chromium.launch();
const p = await b.newPage();
const out = await p.evaluate(async (src) => {
  const img = new Image(); img.src = src; await img.decode();
  const { width: w, height: h } = img;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, w, h), px = d.data;
  // background = the flat pink, the flat mint, or the blended edge between two rays
  const P = [255, 46, 126], D = [-191, 178, 46], DD = D[0] ** 2 + D[1] ** 2 + D[2] ** 2;
  const bg = (i) => {
    const v = [px[i] - P[0], px[i + 1] - P[1], px[i + 2] - P[2]];
    const t = Math.min(1, Math.max(0, (v[0] * D[0] + v[1] * D[1] + v[2] * D[2]) / DD));
    return Math.hypot(v[0] - t * D[0], v[1] - t * D[1], v[2] - t * D[2]) < 90;
  };
  const seen = new Uint8Array(w * h), stack = [];
  for (let i = 0; i < w; i++) stack.push(i, (h - 1) * w + i);
  for (let i = 0; i < h; i++) stack.push(i * w, i * w + w - 1);
  while (stack.length) {
    const n = stack.pop(); if (seen[n]) continue; seen[n] = 1;
    if (!bg(n * 4)) continue;
    px[n * 4 + 3] = 0;
    const X = n % w, Y = (n / w) | 0;
    if (X) stack.push(n - 1); if (X < w - 1) stack.push(n + 1); if (Y) stack.push(n - w); if (Y < h - 1) stack.push(n + w);
  }
  // Keep only the biggest connected shape, which drops leftover specks and ray lines.
  const label = new Int32Array(w * h); let best = 0, bestSize = 0, id = 0;
  for (let n0 = 0; n0 < w * h; n0++) {
    if (label[n0] || !px[n0 * 4 + 3]) continue;
    id++; let size = 0; const st = [n0]; label[n0] = id;
    while (st.length) {
      const n = st.pop(); size++; const X = n % w, Y = (n / w) | 0;
      for (const m of [X ? n - 1 : -1, X < w - 1 ? n + 1 : -1, Y ? n - w : -1, Y < h - 1 ? n + w : -1]) if (m >= 0 && !label[m] && px[m * 4 + 3]) { label[m] = id; st.push(m); }
    }
    if (size > bestSize) { bestSize = size; best = id; }
  }
  for (let n = 0; n < w * h; n++) if (label[n] !== best) px[n * 4 + 3] = 0;
  let t = h, l = w, r = 0, bt = 0;
  for (let y = 0; y < h; y++) for (let X = 0; X < w; X++) if (px[(y * w + X) * 4 + 3]) { if (y < t) t = y; if (y > bt) bt = y; if (X < l) l = X; if (X > r) r = X; }
  x.putImageData(d, 0, 0);
  const o = document.createElement('canvas'); o.width = r - l + 1; o.height = bt - t + 1;
  o.getContext('2d').drawImage(c, l, t, o.width, o.height, 0, 0, o.width, o.height);
  return { url: o.toDataURL('image/png'), w: o.width, h: o.height };
}, src);
writeFileSync(`${dir}poster-kids.png`, Buffer.from(out.url.split(',')[1], 'base64'));
console.log('kids', out.w, out.h);
await b.close();
