// Builds the reusable parts of the media kit: logo, plain backgrounds, stickers, swatches, QR codes.
import { readFileSync, writeFileSync } from 'node:fs';
import opentype from 'opentype.js';
import QRCode from 'qrcode';
import { chromium } from 'playwright';

const K = new URL('./jinglefest-media-kit/', import.meta.url).pathname;
export const C = { ink: '#1b0f12', cream: '#fff3d6', paper: '#fffaf0', red: '#e5142b', redDeep: '#bd0a20', gold: '#ffbf1f', goldDeep: '#ffa400', pine: '#0b5a43', pineDeep: '#07402f', pink: '#ff2e7e', pinkDeep: '#d80f5f', mint: '#38e0ac', mintDeep: '#21c896', night: '#1a0d3a', night2: '#2a1458' };

// ---- Logo as real outlines, so it needs no font installed
const buf = readFileSync(`${K}03-fonts/CinzelDecorative-Black.ttf`);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
function logoPaths() {
  let x = 0; const out = [];
  [...'JINGLEFEST'].forEach((c, i, all) => {
    const size = 200 * (i === 0 ? 1.5 : i === all.length - 1 ? 1.3 : 1);
    const p = font.getPath(c, x, 0, size);
    out.push(p.toPathData(2));
    x += font.getAdvanceWidth(c, size) - (i === 0 ? 12 : 0);
  });
  return { d: out.join(' '), width: x };
}
const { d, width } = logoPaths();
const logoSvg = (fill) => {
  const pad = 40, h = 640, w = width + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(w)} ${h}" role="img" aria-label="Jinglefest"><g transform="translate(${pad} 400) rotate(-6 ${width / 2} 0)"><path d="${d}" fill="${fill}" stroke="${fill}" stroke-width="6" stroke-linejoin="round"/></g></svg>`;
};
const logos = { cream: C.cream, gold: C.gold, ink: C.ink, red: C.red };
for (const [n, c] of Object.entries(logos)) writeFileSync(`${K}01-logo/jinglefest-logo-${n}.svg`, logoSvg(c));

// ---- Stickers
const astro = readFileSync(new URL('./sources/Art.astro', import.meta.url), 'utf8');
for (const m of astro.matchAll(/\{name === '(\w+)' && (?:<>([\s\S]*?)<\/>|(<path[^\n]*?\/>))\}/g)) {
  writeFileSync(`${K}05-stickers/${m[1]}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" stroke="#1b0f12" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">${m[2] ?? m[3]}</svg>`);
}
const points = Array.from({ length: 28 }, (_, i) => { const r = i % 2 ? 41 : 50, a = (i / 28) * Math.PI * 2; return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
for (const [n, c] of [['pink', C.pink], ['gold', C.gold], ['red', C.red], ['mint', C.mint]]) writeFileSync(`${K}05-stickers/starburst-${n}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 104 104"><polygon points="${points}" fill="${c}" stroke="#1b0f12" stroke-width="2" stroke-linejoin="round"/></svg>`);

// ---- QR codes
for (const [n, path] of [['website', '/'], ['bake-off', '/kids/baking'], ['band-battle', '/music'], ['stalls', '/stalls']]) {
  const url = `https://thejinglefest.com${path}`;
  await QRCode.toFile(`${K}09-qr-codes/qr-${n}.png`, url, { width: 1200, margin: 2 });
  await QRCode.toFile(`${K}09-qr-codes/qr-${n}.svg`, url, { type: 'svg', margin: 2 });
}

// ---- Things that need a browser
const b = await chromium.launch();
const shot = async (html, w, h, path, opts = {}) => {
  const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: opts.scale ?? 1 })).newPage();
  await p.goto(`file://${K}`); await p.setContent(html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
  await p.screenshot({ path, omitBackground: !!opts.clear, ...(path.endsWith('jpg') ? { type: 'jpeg', quality: 92 } : {}) });
  await p.context().close();
};
const faces = `@font-face{font-family:Cinzel;src:url(file://${K}03-fonts/CinzelDecorative-Black.ttf)}`;
for (const [n, tube, halo, depth] of [['neon-cream', C.cream, '255 191 31', '.04em .04em 0 #1b0f12'], ['neon-gold', C.gold, '255 191 31', 'none']]) {
  await shot(`<style>${faces}body{margin:0;background:transparent;display:grid;place-items:center;height:100vh;font-family:Cinzel;text-transform:uppercase}
  .w{rotate:-6deg;font-size:230px;color:${tube};-webkit-text-stroke:.028em currentColor;paint-order:stroke fill;white-space:nowrap;line-height:1.1;text-shadow:${depth === 'none' ? '' : depth + ','}0 0 .05em #fff,0 0 .14em rgb(${halo}),0 0 .36em rgb(${halo}/.85),0 0 .8em rgb(${halo}/.55)}
  .f{font-size:1.5em}.l{font-size:1.3em}</style><div class=w><span class=f>J</span>inglefes<span class=l>T</span></div>`, 2000, 900, `${K}01-logo/jinglefest-logo-${n}.png`, { clear: true });
}
for (const n of Object.keys(logos)) await shot(`<body style="margin:0;background:transparent">${logoSvg(logos[n]).replace('<svg ', '<svg style="width:100%;display:block" ')}`, 2000, 900, `${K}01-logo/jinglefest-logo-${n}.png`, { clear: true });

const bursts = { red: [C.red, C.redDeep], gold: [C.gold, C.goldDeep], pink: [C.pink, C.pinkDeep], pine: [C.pine, C.pineDeep], mint: [C.mint, C.mintDeep], night: [C.night, C.night2] };
for (const [n, [a, c]] of Object.entries(bursts)) for (const [s, w, h] of [['feed-1080x1350', 1080, 1350], ['story-1080x1920', 1080, 1920], ['wide-1920x1080', 1920, 1080], ['square-1080x1080', 1080, 1080]]) {
  await shot(`<body style="margin:0;height:100vh;background:repeating-conic-gradient(from 3deg at 50% 50%,${a} 0 10deg,${c} 10deg 20deg)">`, w, h, `${K}04-backgrounds/sunbursts/sunburst-${n}-${s}.jpg`);
}
await shot(`<body style="margin:0;height:100vh;background-color:transparent;background-image:radial-gradient(rgb(27 15 18/.22) 3.2px,transparent 3.6px);background-size:28px 28px">`, 1080, 1350, `${K}04-backgrounds/textures/halftone-dots-transparent.png`, { clear: true });
await shot(`<body style="margin:0;height:100vh;background:repeating-linear-gradient(-45deg,${C.red} 0 48px,#fff 48px 96px)">`, 1920, 200, `${K}04-backgrounds/textures/candy-stripe.jpg`);
const sw = [['Santa Red', C.red], ['Marigold', C.gold], ['Hot Pink', C.pink], ['Pine', C.pine], ['Mint', C.mint], ['Night', C.night], ['Cream', C.cream], ['Ink', C.ink]];
await shot(`<style>body{margin:0;display:grid;grid-template-columns:repeat(4,1fr);height:100vh;font:800 34px system-ui}div{padding:28px;display:flex;flex-direction:column;justify-content:flex-end}small{font-weight:500;font-size:28px}</style>${sw.map(([n, c]) => `<div style="background:${c};color:${['#fff3d6', '#ffbf1f', '#38e0ac'].includes(c) ? C.ink : '#fff'}">${n}<small>${c.toUpperCase()}</small></div>`).join('')}`, 1600, 800, `${K}02-colours/palette.png`);
writeFileSync(`${K}02-colours/palette.txt`, sw.map(([n, c]) => `${n.padEnd(12)}${c.toUpperCase()}`).join('\n') + '\n');
await b.close();
console.log('kit parts built');
