// Builds the Band Battle building blocks in jinglefest-media-kit/11-band-battle/: lockups, fact badges,
// stickers, stage backgrounds and a band cut-out. Every word is typeset here, never by an image model.
// Usage: bun band.mjs            (rebuilds everything; needs art/band-4x5.png for the cut-out)
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';

const root = new URL('./', import.meta.url).pathname;
const K = `${root}jinglefest-media-kit/`;
const OUT = `${K}11-band-battle/`;
for (const d of ['lockups', 'badges', 'stickers', 'backgrounds', 'cutouts']) mkdirSync(`${OUT}${d}`, { recursive: true });
const C = { ink: '#1b0f12', cream: '#fff3d6', paper: '#fffaf0', red: '#e5142b', gold: '#ffbf1f', pink: '#ff2e7e', pine: '#0b5a43', mint: '#38e0ac', night: '#1a0d3a' };

const fonts = `
@font-face{font-family:Cinzel;src:url(file://${K}03-fonts/CinzelDecorative-Black.ttf)}
@font-face{font-family:Anton;src:url(file://${K}03-fonts/Anton-Regular.ttf)}
@font-face{font-family:Bricolage;font-weight:200 800;src:url(file://${K}03-fonts/BricolageGrotesque-Variable.ttf)}
*{box-sizing:border-box;margin:0}html,body{background:transparent}body{font-family:Bricolage;color:${C.ink}}
.logo{font-family:Cinzel;font-weight:900;text-transform:uppercase;white-space:nowrap;display:inline-block;rotate:-6deg;line-height:1.1;color:${C.cream};-webkit-text-stroke:.028em currentColor;paint-order:stroke fill;text-shadow:.04em .04em 0 ${C.ink},0 0 .05em #fff,0 0 .14em ${C.gold},0 0 .36em rgb(255 191 31/.85),0 0 .8em rgb(255 191 31/.55)}
.logo i{font-style:normal;font-size:1.5em}.logo u{text-decoration:none;font-size:1.3em}
.bb{font-family:Anton;text-transform:uppercase;line-height:1.02;color:${C.cream};-webkit-text-stroke:.085em ${C.ink};paint-order:stroke fill;filter:drop-shadow(.035em .035em 0 ${C.ink})}
.bb em{font-style:normal;color:${C.gold}}
`;
const LOGO = '<span class="logo"><i>J</i>inglefes<u>T</u></span>';

// ---- 1. Stickers: hand-drawn SVG, same style as 05-stickers (ink outline, flat brand colours).
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">\n${body}\n</svg>\n`;
const stickers = {
  drum: svg(`  <path fill="${C.red}" d="M20 52v34c0 10 18 18 40 18s40-8 40-18V52"/>
  <path fill="none" stroke-width="4" d="M26 62l14 36M46 66l14 38M66 66l-6 38M86 62 74 100M60 104 46 66"/>
  <ellipse cx="60" cy="52" rx="40" ry="15" fill="${C.cream}"/>
  <path fill="none" stroke-width="7" d="M24 14l30 30M98 10 70 42"/>
  <circle cx="22" cy="12" r="6" fill="${C.gold}"/><circle cx="100" cy="8" r="6" fill="${C.gold}"/>`),
  keys: svg(`  <rect x="6" y="34" width="108" height="56" rx="8" fill="${C.mint}"/>
  <rect x="14" y="54" width="92" height="30" rx="3" fill="${C.paper}"/>
  <path fill="none" stroke-width="3" d="M27 54v30M40 54v30M53 54v30M66 54v30M79 54v30M92 54v30"/>
  <path fill="${C.ink}" stroke="none" d="M23 54h8v17h-8zM36 54h8v17h-8zM62 54h8v17h-8zM75 54h8v17h-8zM88 54h8v17h-8z"/>
  <circle cx="22" cy="44" r="3.5" fill="${C.gold}" stroke-width="3"/><circle cx="34" cy="44" r="3.5" fill="${C.pink}" stroke-width="3"/>
  <path fill="none" stroke-width="4" d="M30 90 22 112M90 90l8 22"/>`),
  amp: svg(`  <rect x="16" y="14" width="88" height="94" rx="10" fill="${C.ink}"/>
  <rect x="24" y="22" width="72" height="18" rx="4" fill="${C.gold}"/>
  <circle cx="36" cy="31" r="4" fill="${C.cream}" stroke-width="3"/><circle cx="52" cy="31" r="4" fill="${C.cream}" stroke-width="3"/><circle cx="68" cy="31" r="4" fill="${C.cream}" stroke-width="3"/>
  <circle cx="60" cy="74" r="26" fill="${C.pink}" stroke="${C.cream}" stroke-width="4"/>
  <circle cx="60" cy="74" r="10" fill="${C.ink}" stroke="${C.cream}" stroke-width="3"/>`),
  notes: svg(`  <path fill="none" stroke-width="7" d="M44 88V26l56-12v62"/>
  <path fill="${C.ink}" stroke="none" d="M44 26l56-12v14l-56 12z"/>
  <ellipse cx="32" cy="90" rx="16" ry="12" fill="${C.pink}" transform="rotate(-20 32 90)"/>
  <ellipse cx="88" cy="78" rx="16" ry="12" fill="${C.mint}" transform="rotate(-20 88 78)"/>
  <path fill="${C.gold}" d="M14 22l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" stroke-width="3"/>`),
  pick: svg(`  <path fill="${C.gold}" d="M60 112C40 92 14 62 14 36c0-16 20-26 46-26s46 10 46 26c0 26-26 56-46 76z"/>
  <path fill="${C.red}" d="M60 30l7 14 15 2-11 11 3 15-14-7-14 7 3-15-11-11 15-2z" stroke-width="4"/>`),
  headphones: svg(`  <path fill="none" stroke-width="9" d="M22 74V58a38 38 0 0 1 76 0v16"/>
  <path fill="none" stroke="${C.red}" stroke-width="3" d="M22 74V58a38 38 0 0 1 76 0v16"/>
  <rect x="10" y="64" width="24" height="40" rx="10" fill="${C.pink}"/>
  <rect x="86" y="64" width="24" height="40" rx="10" fill="${C.pink}"/>`),
};
for (const [n, s] of Object.entries(stickers)) writeFileSync(`${OUT}stickers/${n}.svg`, s);

// ---- 2. Lockups and badges: HTML rendered to transparent PNG at 2x.
const lockups = {
  'band-battle-stacked': `<div class=bb style="font-size:220px">Band<br><em>Battle</em></div>`,
  'band-battle-wide': `<div class=bb style="font-size:180px;white-space:nowrap">Band <em>Battle</em></div>`,
  'jinglefest-band-battle': `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:10px">${LOGO.replace('class="logo"', 'class="logo" style="font-size:86px;margin-left:10px"')}<div class=bb style="font-size:200px">Band<br><em>Battle</em></div></div>`,
  'band-battle-tagline': `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:18px"><div class=bb style="font-size:180px;white-space:nowrap">Band <em>Battle</em></div><span style="font-family:Anton;text-transform:uppercase;letter-spacing:.05em;font-size:44px;background:${C.ink};color:${C.gold};padding:.12em .6em;border-radius:12px">Intercollegiate music competition</span></div>`,
};
const coupon = (big, small, bg = C.paper, fg = C.ink, accent = C.red) => `<div style="position:relative;display:inline-flex;flex-direction:column;align-items:flex-start;padding:22px 34px 24px;background:${bg};color:${fg};border:5px solid ${C.ink};border-radius:24px;box-shadow:10px 10px 0 ${C.ink}"><div style="position:absolute;inset:10px;border:2.5px dashed ${fg === C.ink ? 'rgb(27 15 18/.45)' : 'rgb(255 255 255/.55)'};border-radius:15px"></div><b style="font-family:Anton;font-weight:400;text-transform:uppercase;font-size:34px;letter-spacing:.04em;color:${accent}">${small}</b><span style="font-family:Anton;text-transform:uppercase;font-size:76px;line-height:1.02;white-space:nowrap">${big}</span></div>`;
const burstPts = Array.from({ length: 28 }, (_, i) => { const r = i % 2 ? 41 : 50, a = (i / 28) * Math.PI * 2; return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
const burst = (text, color, fg = '#fff', size = 380) => `<div style="position:relative;width:${size}px;height:${size}px;display:grid;place-items:center;rotate:8deg;filter:drop-shadow(8px 8px 0 ${C.ink})"><svg viewBox="-2 -2 104 104" style="position:absolute;inset:0"><polygon points="${burstPts}" fill="${color}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/></svg><span style="position:relative;font-family:Anton;text-transform:uppercase;text-align:center;line-height:1.02;padding:0 15%;color:${fg};font-size:${size * 0.15}px">${text}</span></div>`;
const badges = {
  'screening-28-november': coupon('28 November', 'Screening'),
  'final-6-december': coupon('6 December', 'Final at the Christmas Carnival', C.gold),
  'up-to-5-members': coupon('Up to 5', 'Members per band', C.mint),
  'christmas-songs-only': coupon('Christmas songs', 'Only', C.pink, '#fff', C.gold),
  'college-bands': coupon('College bands', 'Intercollegiate'),
  'cash-prize': coupon('Cash prize', '+ dine-in coupons', C.gold),
  'public-vote': coupon('Public vote', 'Picks the winner', C.night, C.cream, C.gold),
  'dinner-included': coupon('Dinner on us', 'Both days', C.mint),
  'entry-fee': coupon('₹350 a person', '+ ₹550 a band'),
  'register-music': coupon('thejinglefest.com/music', 'Register', C.ink, C.gold, C.pink),
  'burst-register-now': burst('Register<br>now', C.pink),
  'burst-5-bands': burst('Only<br>5 bands', C.gold, C.ink),
  'burst-christmas-songs': burst('Christmas<br>songs only', C.red),
};

// ---- 3. Stage backgrounds: night sky, coloured beams and fairy lights, all CSS. No words.
const bulbs = (w, y0, sag) => { const n = Math.round(w / 70), cols = [C.gold, C.pink, C.mint, C.red, C.cream]; let s = `<path d="M-10 ${y0} Q ${w / 2} ${y0 + sag * 2} ${w + 10} ${y0}" fill="none" stroke="${C.ink}" stroke-width="4"/>`; for (let i = 0; i <= n; i++) { const t = i / n, x = -10 + t * (w + 20), y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * (y0 + sag * 2) + t * t * y0; s += `<circle cx="${x.toFixed(1)}" cy="${(y + 14).toFixed(1)}" r="11" fill="${cols[i % 5]}" stroke="${C.ink}" stroke-width="3.5"/>`; } return s; };
const stage = (w, h) => `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:radial-gradient(ellipse at 50% 110%,#3a1d6e 0,${C.night} 65%)">
${[[0.12, C.pink, -16], [0.38, C.gold, -6], [0.62, C.mint, 6], [0.88, C.pink, 16]].map(([x, c, r]) => `<i style="position:absolute;top:-8%;left:${x * 100}%;width:${Math.max(w, h) * 0.24}px;height:130%;margin-left:-${Math.max(w, h) * 0.12}px;transform-origin:50% 0;rotate:${r}deg;background:linear-gradient(${c},transparent 85%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);opacity:.42;mix-blend-mode:screen"></i>`).join('')}
<div style="position:absolute;left:0;right:0;bottom:0;height:${Math.round(h * 0.09)}px;background:${C.ink};border-top:5px solid ${C.gold}"></div>
<svg width="${w}" height="${h}" style="position:absolute;inset:0">${bulbs(w, Math.round(h * 0.04), Math.round(h * 0.035))}</svg></div>`;
const backgrounds = { square: [1080, 1080], feed: [1080, 1350], story: [1080, 1920], wide: [1920, 1080] };

const b = await chromium.launch();
const render = async (html, path, size, transparent) => {
  const ctx = await b.newContext({ viewport: size ? { width: size[0], height: size[1] } : { width: 2400, height: 1600 }, deviceScaleFactor: transparent ? 2 : 1 });
  const p = await ctx.newPage();
  // A file page, so the file:// fonts are allowed to load.
  const f = `${root}.tmp-band.html`;
  writeFileSync(f, `<!doctype html><meta charset=utf-8><style>${fonts}</style><div id=x style="display:inline-block">${html}</div>`);
  await p.goto(`file://${f}`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  if (transparent) await p.locator('#x').screenshot({ path, omitBackground: true });
  else await p.screenshot({ path, type: 'jpeg', quality: 92 });
  await ctx.close(); unlinkSync(f); console.log('wrote', path.replace(K, ''));
};
// Padding so shadows and tilted bursts aren't clipped.
const pad = (h) => `<div style="padding:28px 34px 36px 22px">${h}</div>`;
for (const [n, h] of Object.entries(lockups)) await render(pad(h), `${OUT}lockups/${n}.png`, null, true);
for (const [n, h] of Object.entries(badges)) await render(pad(h), `${OUT}badges/${n}.png`, null, true);
for (const [n, h] of Object.entries(stickers)) await render(`<img src="data:image/svg+xml;base64,${Buffer.from(h).toString('base64')}" width=600 height=600>`, `${OUT}stickers/${n}.png`, null, true);
for (const [n, [w, h]] of Object.entries(backgrounds)) await render(stage(w, h), `${OUT}backgrounds/stage-${n}-${w}x${h}.jpg`, [w, h], false);

// ---- 4. Band cut-out: lift the four players off art/band-4x5.png's night-and-beams background.
// Flood-fills background colours from the top and the upper sides only (the players run off the bottom edge),
// then keeps the biggest shape. Check the result by eye: open it on a dark and a light background.
const src = `data:image/png;base64,${readFileSync(`${root}art/band-4x5.png`).toString('base64')}`;
const page = await b.newPage();
const png = await page.evaluate(async (src) => {
  const img = new Image(); img.src = src; await img.decode();
  const { width: w, height: h } = img;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, w, h), px = d.data;
  // Learn the background colours from the empty top 45%.
  const buckets = new Map();
  for (let y = 0; y < h * 0.45; y += 3) for (let X = 0; X < w; X += 3) { const i = (y * w + X) * 4, k = (px[i] >> 4) << 8 | (px[i + 1] >> 4) << 4 | px[i + 2] >> 4; buckets.set(k, (buckets.get(k) || 0) + 1); }
  const total = [...buckets.values()].reduce((a, b) => a + b, 0);
  const pal = [...buckets].filter(([, n]) => n > total * 0.03).map(([k]) => [((k >> 8) & 15) * 16 + 8, ((k >> 4) & 15) * 16 + 8, (k & 15) * 16 + 8]);
  const near = (i, t = 48) => {
    const v = [px[i], px[i + 1], px[i + 2]];
    for (const a of pal) if (Math.hypot(v[0] - a[0], v[1] - a[1], v[2] - a[2]) < t) return true;
    for (let p = 0; p < pal.length; p++) for (let q = p + 1; q < pal.length; q++) { // blended ray edges
      const A = pal[p], D = [pal[q][0] - A[0], pal[q][1] - A[1], pal[q][2] - A[2]], DD = D[0] ** 2 + D[1] ** 2 + D[2] ** 2;
      const u = [v[0] - A[0], v[1] - A[1], v[2] - A[2]], s = Math.min(1, Math.max(0, (u[0] * D[0] + u[1] * D[1] + u[2] * D[2]) / DD));
      if (Math.hypot(u[0] - s * D[0], u[1] - s * D[1], u[2] - s * D[2]) < 30) return true;
    }
    return false;
  };
  const seen = new Uint8Array(w * h), stack = [];
  for (let i = 0; i < w; i++) stack.push(i);
  for (let y = 0; y < h * 0.8; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const n = stack.pop(); if (seen[n]) continue; seen[n] = 1;
    if (!near(n * 4)) continue;
    px[n * 4 + 3] = 0;
    const X = n % w, Y = (n / w) | 0;
    if (X) stack.push(n - 1); if (X < w - 1) stack.push(n + 1); if (Y) stack.push(n - w); if (Y < h - 1) stack.push(n + w);
  }
  // Beam patches trapped between players: nobody wears purple, so clear purple above the stage edge.
  for (let n = 0; n < w * Math.floor(h * 0.9); n++) { const i = n * 4, r = px[i], g = px[i + 1], bl = px[i + 2]; if (bl > r + 12 && bl > g + 25 && r < 150) px[i + 3] = 0; }
  const label = new Int32Array(w * h); let best = 0, bestSize = 0, id = 0;
  for (let n0 = 0; n0 < w * h; n0++) {
    if (label[n0] || !px[n0 * 4 + 3]) continue;
    id++; let size = 0; const st = [n0]; label[n0] = id;
    while (st.length) { const n = st.pop(); size++; const X = n % w, Y = (n / w) | 0; for (const m of [X ? n - 1 : -1, X < w - 1 ? n + 1 : -1, Y ? n - w : -1, Y < h - 1 ? n + w : -1]) if (m >= 0 && !label[m] && px[m * 4 + 3]) { label[m] = id; st.push(m); } }
    if (size > bestSize) { bestSize = size; best = id; }
  }
  // Drop thin strands (light wires, beam edges): erode then dilate the mask by 4 px.
  const r = 4, A = new Uint8Array(w * h);
  for (let n = 0; n < w * h; n++) A[n] = label[n] === best ? 1 : 0;
  const pass = (src, keep) => { const t = new Uint8Array(w * h), o = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let X = 0; X < w; X++) { let v = keep; for (let k = -r; k <= r; k++) { const q = X + k; const a = q < 0 || q >= w ? 0 : src[y * w + q]; if (a !== keep) { v = a; break; } } t[y * w + X] = v; }
    for (let y = 0; y < h; y++) for (let X = 0; X < w; X++) { let v = keep; for (let k = -r; k <= r; k++) { const q = y + k; const a = q < 0 || q >= h ? (keep ? 1 : 0) : t[q * w + X]; if (a !== keep) { v = a; break; } } o[y * w + X] = v; }
    return o; };
  const open = pass(pass(A, 1), 0);
  for (let n = 0; n < w * h; n++) if (!open[n]) label[n] = 0;
  let top = h;
  for (let n = 0; n < w * h; n++) { if (label[n] !== best) px[n * 4 + 3] = 0; else top = Math.min(top, (n / w) | 0); }
  x.putImageData(d, 0, 0);
  const o = document.createElement('canvas'); o.width = w; o.height = h - top;
  o.getContext('2d').drawImage(c, 0, top, w, h - top, 0, 0, w, h - top);
  return o.toDataURL('image/png').split(',')[1];
}, src);
writeFileSync(`${OUT}cutouts/band.png`, Buffer.from(png, 'base64'));
writeFileSync(`${root}art/band-cutout.png`, Buffer.from(png, 'base64'));
console.log('wrote 11-band-battle/cutouts/band.png');
await b.close();
