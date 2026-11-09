// Typesets the poster and social posts over the Gemini scenes.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { posts, PHONES } from './posts.mjs';

const root = new URL('./', import.meta.url).pathname;
const K = `${root}jinglefest-media-kit/`;
const only = process.argv[2];
const C = { ink: '#1b0f12', cream: '#fff3d6', paper: '#fffaf0', red: '#e5142b', gold: '#ffbf1f', pink: '#ff2e7e', pine: '#0b5a43', mint: '#38e0ac' };
const burstPts = Array.from({ length: 28 }, (_, i) => { const r = i % 2 ? 41 : 50, a = (i / 28) * Math.PI * 2; return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
const burst = (text, size, color = C.pink, fg = '#fff') => `<div class="burst" style="width:${size}px;height:${size}px;rotate:8deg"><svg viewBox="-2 -2 104 104"><polygon points="${burstPts}" fill="${color}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/></svg><span style="color:${fg};font-size:${size * 0.16}px">${text}</span></div>`;
const base = `
@font-face{font-family:Cinzel;src:url(file://${K}03-fonts/CinzelDecorative-Black.ttf)}
@font-face{font-family:Anton;src:url(file://${K}03-fonts/Anton-Regular.ttf)}
@font-face{font-family:Shrikhand;src:url(file://${K}03-fonts/Shrikhand-Regular.ttf)}
@font-face{font-family:Bricolage;font-weight:200 800;src:url(file://${K}03-fonts/BricolageGrotesque-Variable.ttf)}
*{box-sizing:border-box;margin:0}
body{position:relative;overflow:hidden;font-family:Bricolage;color:${C.ink};background:${C.gold}}
.logo{font-family:Cinzel;font-weight:900;text-transform:uppercase;white-space:nowrap;display:inline-block;rotate:-6deg;line-height:1.1;color:${C.cream};-webkit-text-stroke:.028em currentColor;paint-order:stroke fill;text-shadow:.04em .04em 0 ${C.ink},0 0 .05em #fff,0 0 .14em ${C.gold},0 0 .36em rgb(255 191 31/.85),0 0 .8em rgb(255 191 31/.55)}
.logo i{font-style:normal;font-size:1.5em}.logo u{text-decoration:none;font-size:1.3em}
.shout{font-family:Anton;text-transform:uppercase;line-height:1.02;letter-spacing:.01em}
.burst{position:relative;display:grid;place-items:center;filter:drop-shadow(5px 5px 0 ${C.ink})}
.burst svg{position:absolute;inset:0}.burst span{position:relative;font-family:Anton;text-transform:uppercase;text-align:center;line-height:1.02;padding:0 13%}
.coupon{position:relative;background:${C.paper};border:4px solid ${C.ink};border-radius:22px;box-shadow:9px 9px 0 ${C.ink}}
.coupon::before{content:'';position:absolute;inset:9px;border:2px dashed rgb(27 15 18/.45);border-radius:14px;pointer-events:none}
`;
const LOGO = '<span class="logo"><i>J</i>inglefes<u>T</u></span>';

const glue = (t) => t?.replace(/(\d{1,2}) (November|December)/g, '$1&nbsp;$2').replace(/5 × 10 ft/g, '5&nbsp;×&nbsp;10&nbsp;ft').replace(/(\d:\d\d) PM/g, '$1&nbsp;PM');
const qrFor = (url) => { const n = url.endsWith('/music') ? 'band-battle' : url.endsWith('/stalls') ? 'stalls' : url.endsWith('/baking') ? 'bake-off' : 'website'; return readFileSync(`${K}09-qr-codes/qr-${n}.svg`, 'utf8'); };
const postHtml = (p, story) => {
  const W = 1080, H = story ? 1920 : 1350;
  const art = `file://${root}art/${p.scene}-${story ? '9x16' : '4x5'}.png`;
    const qr = `<div class="qr"><div>${qrFor(p.url)}</div><span>Scan me</span></div>`;
  const offer = p.offer ? `<div class=offer><p><s>${p.offer.was}</s> <b>${p.offer.now}</b></p><span>${p.offer.line}</span></div>` : '';
  const foot = `<div class="foot"><div class="ft"><span class="shout url">${p.url}</span><span class="ph"><b>Call</b> ${PHONES}</span></div>${story ? qr : ''}</div>`;
  return `<!doctype html><meta charset=utf-8><style>${base}
  body{width:${W}px;height:${H}px}
  .bg{position:absolute;left:0;top:-14px;width:100%;height:calc(100% + 14px);object-fit:cover;transform-origin:50% 0;scale:${story ? 1.2 : 1.09}}
  .stack{position:absolute;left:58px;right:58px;top:${story ? 240 : 44}px;display:flex;flex-direction:column;gap:${story ? 26 : 16}px;align-items:flex-start}
  .logo{font-size:${story ? 64 : 56}px;margin-bottom:${story ? 12 : 4}px;transform-origin:left}
  .kick{font-family:Anton;text-transform:uppercase;letter-spacing:.04em;background:${C.ink};color:${C.gold};font-size:${story ? 40 : 34}px;padding:.14em .6em;border-radius:9px}
  h1{font-family:Anton;font-weight:400;text-transform:uppercase;line-height:1.06;font-size:190px;color:${C.cream};width:100%;-webkit-text-stroke:16px ${C.ink};paint-order:stroke fill;filter:drop-shadow(6px 6px 0 ${C.ink})}
  h1 em{font-style:normal;color:${C.gold}}
  .sub{padding:18px 26px;font-size:${story ? 38 : 33}px;font-weight:600;line-height:1.22;max-width:100%}
  .sub b{font-weight:800}
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:18px;width:100%}
  .cards div{padding:20px 22px}.cards b{display:block;font-family:Anton;font-weight:400;text-transform:uppercase;font-size:30px;color:${C.red};margin-bottom:6px}.cards span{font-size:38px;font-weight:800;line-height:1.1}
  .foot{${story ? 'margin-top:6px;width:100%;border-radius:16px;justify-content:space-between;align-items:center;padding:14px 16px 14px 30px' : 'position:absolute;left:0;right:0;bottom:0;padding:16px 30px'};display:flex;background:${C.ink};color:${C.cream}}
  .ft{display:flex;${story ? 'flex-direction:column;gap:6px' : 'width:100%;justify-content:space-between;align-items:center'}}
  .qr{${story ? '' : 'position:absolute;right:30px;bottom:92px;'}background:#fff;border:4px solid ${C.ink};border-radius:14px;padding:7px 7px 3px;box-shadow:5px 5px 0 ${C.ink};text-align:center}
  .qr div{width:${story ? 172 : 176}px;height:${story ? 172 : 176}px}.qr svg{display:block;width:100%;height:100%}.qr span{font-family:Anton;text-transform:uppercase;font-size:24px;color:${C.ink};letter-spacing:.04em}
  .url{color:${C.gold};font-size:${story ? 42 : 38}px;text-transform:none}.ph{font-weight:700;font-size:${story ? 30 : 25}px;white-space:nowrap}.ph b{color:${C.gold}}
  .kr{display:flex;flex-wrap:wrap;gap:10px 12px;align-items:center}
  .spon{background:${C.paper};border:3px solid ${C.ink};border-radius:9px;padding:.22em .6em;font-size:${story ? 29 : 25}px;font-weight:700;white-space:nowrap}.spon b{font-weight:800;color:${C.red}}
  .offer{position:absolute;right:${story ? 44 : 40}px;top:${story ? 214 : 22}px;rotate:2deg;text-align:right;background:${C.pink};color:#fff;border:4px solid ${C.ink};border-radius:18px;box-shadow:7px 7px 0 ${C.ink};padding:${story ? '4px 22px 10px' : '0 18px 7px'}}
  .offer p{font-family:Anton;font-size:${story ? 74 : 60}px;line-height:1.1}.offer s{font-size:.6em;opacity:.85}.offer b{font-weight:400;color:#fff}.offer span{display:block;font-size:${story ? 25 : 23}px;font-weight:800;white-space:nowrap}
  .tag{position:absolute;right:44px;top:${story ? 215 : 30}px}
  </style><img class=bg src="${art}">
  <div class=stack>${LOGO}<div class=kr${story && p.burst ? ' style="flex-direction:column;align-items:flex-start"' : ''}><span class=kick>${p.kicker}</span><span class=spon>Made possible by <b>Bread &amp; Brew</b></span></div><h1>${p.head}</h1>
  ${p.sub ? `<div class="coupon sub">${glue(p.sub)}</div>` : ''}
  ${p.cards ? `<div class=cards>${p.cards.map(([a, b]) => `<div class=coupon><b>${a}</b><span>${b}</span></div>`).join('')}</div>` : ''}
  ${story ? foot : ''}</div>${offer}${story ? '' : foot + qr}
  ${p.burst ? `<div class=tag>${burst(p.burst, story ? 230 : 196)}</div>` : ''}
  <script>
    document.fonts.ready.then(()=>{const h=document.querySelector('h1'),s=document.querySelector('.stack');const limit=${story ? 1225 : 730};let f=190;
      const fits=()=>{const w=[...h.childNodes];const r=document.createRange();r.selectNodeContents(h);return r.getBoundingClientRect().width<=h.clientWidth+1&&h.scrollWidth<=h.clientWidth+1&&s.getBoundingClientRect().bottom<=limit};
      h.style.whiteSpace='nowrap';while(f>84&&!fits()){f-=4;h.style.fontSize=f+'px'}document.body.dataset.fit=f;});
  </script>`;
};

const bbLogo = readFileSync(`${root}art/bread-and-brew-logo.svg`, 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<defs>[\s\S]*?<\/defs>/, '').replace(/<path class="[^"]*" d="M([\d.]+)/g, (m, x) => `<path fill="${Number(x) < 110 ? '#c9a06a' : '#fff'}" d="M${x}`);
const posterHtml = () => `<!doctype html><meta charset=utf-8><style>${base}
  body{width:1280px;height:1600px;background:${C.mint}}
  .art{position:absolute;inset:0;background:repeating-conic-gradient(from 4deg at 50% 66%,${C.mint} 0 11deg,${C.pink} 11deg 22deg)}
  .kids{position:absolute;left:50%;translate:-50% 0;bottom:196px;height:652px}
  .top{position:absolute;inset:0 0 auto 0;height:668px;overflow:hidden;background:repeating-conic-gradient(from 3deg at 50% 40%,${C.red} 0 10deg,#bd0a20 10deg 20deg);color:${C.cream};padding:34px 40px 0;text-align:center}
  .stripe{position:absolute;left:0;right:0;top:668px;height:22px;background:repeating-linear-gradient(-45deg,${C.ink} 0 22px,${C.gold} 22px 44px);border-block:4px solid ${C.ink}}
  .row{display:flex;justify-content:center;align-items:center;gap:46px;height:176px}
  .logo{font-size:84px}
  .bb{position:relative;background:#11614b;border:4px solid ${C.ink};border-radius:18px;box-shadow:6px 6px 0 ${C.ink};padding:14px 26px 8px;height:166px;display:grid;place-items:center}
  .bb svg{display:block;height:128px;width:auto}.bb svg polygon,.bb svg rect{fill:#c9a06a}
  .bb span{position:absolute;left:50%;translate:-50% 0;top:-17px;white-space:nowrap;background:${C.gold};color:${C.ink};border:3px solid ${C.ink};border-radius:8px;font-size:21px;font-weight:800;padding:0 .6em;line-height:1.35}
  h1{font-family:Anton;font-weight:400;text-transform:uppercase;font-size:186px;line-height:1.03;margin-top:12px;text-shadow:7px 7px 0 ${C.ink};white-space:nowrap}
  h1 em{font-style:normal;color:${C.gold}}
  .pill{position:absolute;left:50%;translate:-50% 0;top:640px;z-index:3;white-space:nowrap;background:${C.pine};color:#fff;border:4px solid ${C.ink};border-radius:99px;padding:.1em .8em;font-family:Anton;font-size:52px;box-shadow:6px 6px 0 ${C.ink}}
  .chip{position:absolute;z-index:3;top:748px;text-align:center;background:${C.paper};border:4px solid ${C.ink};border-radius:16px;box-shadow:6px 6px 0 ${C.ink};padding:.24em .6em;font-family:Anton;font-size:38px;line-height:1.2;text-transform:uppercase}.chip b{display:block;font-weight:400;color:${C.red}}
  .chip.l{left:40px;rotate:-3deg}.chip.r{right:40px;rotate:3deg}
  .foot{position:absolute;left:0;right:0;bottom:0;height:226px;background:${C.ink};color:${C.cream};display:flex;align-items:center;gap:24px;padding:0 44px}
  .foot .t{flex:1;min-width:0}.foot .v{font-size:32px;font-weight:600}.foot .v b{font-weight:800;color:${C.gold}}
  .foot .r{font-family:Anton;font-size:54px;color:${C.gold};margin-block:4px;text-transform:uppercase}.foot .c{font-size:32px;font-weight:700}
  .qr{width:196px;height:196px;background:#fff;border-radius:12px;padding:5px}
  .qr svg{display:block;width:100%;height:100%}
</style>
<div class=art></div>
<img class=kids src="file://${root}art/poster-kids.png">
<div class=top>
  <div class=row>${LOGO}<div class=bb><span>Made possible by</span>${bbLogo}</div></div>
  <h1>Little Chefs<br><em>Bake-Off</em></h1>
</div>
<div class=stripe></div>
<div class=pill>14 NOVEMBER 2026 · 4:30 PM ONWARDS</div>
<div class="chip l">Ages<b>8–12 &amp; 13–16</b></div>
<div class="chip r">Only<b>20 slots</b></div>
<div class=foot>
  <div class=t>
    <p class=v><b>Bread &amp; Brew</b>, Thailavaram Bus Stop, GST Road, Potheri</p>
    <p class=r>Scan to register</p>
    <p class=c>Call ${PHONES}</p>
  </div>
  <div class=qr>${readFileSync(`${K}09-qr-codes/qr-bake-off.svg`, 'utf8')}</div>
</div>`;

// A5 flyer: 148 x 210 mm plus 3 mm bleed on every side, drawn on a 1332 x 1868 canvas (26 px = 3 mm).
const BLEED = 26, SHEET = { w: 1332, h: 1868 }, TRIM = { w: 1280, h: 1816 };
const a5Html = () => posterHtml().replace('</style>', `
  body{width:${SHEET.w}px;height:${SHEET.h}px}
  .top{height:728px;padding-top:66px}
  .row{height:178px}
  .bb span{font-size:24px}
  h1{font-size:192px}
  .stripe{top:728px}
  .pill{top:699px}
  .chip{top:808px}.chip.l{left:70px}.chip.r{right:70px}
  .kids{bottom:262px;height:752px}
  .foot{height:290px;padding:0 72px 26px;gap:30px}
  .qr{width:240px;height:240px;padding:8px}
  .foot .v,.foot .c{font-size:33px}.foot .r{font-size:62px}
</style>`);

const a5 = async () => {
  const out = `${K}07-poster/little-chefs-bake-off-a5`;
  const scale = 3638 / SHEET.w; // 154 mm at 600 dpi
  const ctx = await b.newContext({ viewport: { width: SHEET.w, height: SHEET.h }, deviceScaleFactor: scale });
  const p = await ctx.newPage();
  const f = `${root}.tmp-page.html`;
  const fs = await import('node:fs');
  fs.writeFileSync(f, a5Html());
  await p.goto(`file://${f}`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}-bleed.png` });
  await p.screenshot({ path: `${out}.png`, clip: { x: BLEED, y: BLEED, width: TRIM.w, height: TRIM.h } });
  fs.unlinkSync(f);
  // The PDFs carry the 600 dpi image, so a print shop gets exactly what this render shows.
  for (const [png, pdf, w, h] of [[`${out}.png`, `${out}-print.pdf`, 148, 210], [`${out}-bleed.png`, `${out}-print-with-bleed.pdf`, 154, 216]]) {
    const page = await ctx.newPage();
    fs.writeFileSync(f, `<!doctype html><style>@page{size:${w}mm ${h}mm;margin:0}html,body{margin:0}img{display:block;width:${w}mm;height:${h}mm}</style><img src="file://${png}">`);
    await page.goto(`file://${f}`); await page.waitForLoadState('load');
    await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true, pageRanges: '1' });
    fs.unlinkSync(f);
  }
  fs.unlinkSync(`${out}-bleed.png`);
  await ctx.close();
};

const b = await chromium.launch();
const shot = async (html, w, h, scale, path, pdf) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const p = await ctx.newPage();
  await p.goto(`file://${root}render.mjs`).catch(() => {});
  const f = `${root}.tmp-page.html`;
  (await import('node:fs')).writeFileSync(f, html);
  await p.goto(`file://${f}`); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const fit = await p.evaluate(() => ({ fit: document.body.dataset.fit, bottom: Math.round(document.querySelector('.stack')?.getBoundingClientRect().bottom ?? 0) }));
  await p.screenshot({ path, ...(path.endsWith('jpg') ? { type: 'jpeg', quality: 93 } : {}) });
  if (pdf) await p.addStyleTag({ content: `@page{size:${w}px ${h}px;margin:0}html,body{margin:0;padding:0;width:${w}px;height:${h}px}` }); await p.emulateMedia({ media: 'screen' }); await p.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true, pageRanges: '1', scale: 1 });
  await ctx.close(); (await import('node:fs')).unlinkSync(f); return fit;
};
if (only === 'a5') { await a5(); console.log('a5'); await b.close(); process.exit(0); }
if (!only || only === 'poster') { await shot(posterHtml(), 1280, 1600, 2, `${K}07-poster/little-chefs-bake-off-poster.png`, `${K}07-poster/little-chefs-bake-off-poster.pdf`); console.log('poster'); }
if (only !== 'poster') for (const p of posts) {
  if (only && String(p.day) !== only) continue;
  const n = `day-${String(p.day).padStart(2, '0')}-${p.date.replace(' ', '').toLowerCase()}-${p.scene}`;
  const a = await shot(postHtml(p, false), 1080, 1350, 1, `${K}08-socials/feed-4x5/${n}.jpg`);
  const c = await shot(postHtml(p, true), 1080, 1920, 1, `${K}08-socials/story-9x16/${n}.jpg`);
  console.log(n, 'feed', a, 'story', c);
}
await b.close();
