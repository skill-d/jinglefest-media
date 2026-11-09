// Generates text-free illustration parts with Gemini or Grok. All wording is typeset afterwards in
// render.mjs, because image models can't be trusted with dates and phone numbers.
// Usage: node gen.mjs [gemini|grok] [name ...]
//   gemini needs GEMINI_API_KEY (model: GEMINI_MODEL, default gemini-3.1-flash-image)
//   grok   needs XAI_API_KEY    (model: GROK_MODEL, default grok-imagine-image)
// With no names, makes only scenes that don't exist yet. With names, remakes those (prefix match).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { art, STYLE } from './art.mjs';

const provider = ['gemini', 'grok'].includes(process.argv[2]) ? process.argv[2] : 'gemini';
const only = process.argv.slice(['gemini', 'grok'].includes(process.argv[2]) ? 3 : 2);
const dir = new URL('./art/', import.meta.url).pathname;
const ref = readFileSync(new URL('./sources/og-home.jpg', import.meta.url)).toString('base64');

// Each returns PNG/JPEG bytes, or throws with a short reason.
const providers = {
  async gemini(prompt, aspectRatio) {
    const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-image';
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: `${STYLE}\n\nThe attached image only shows the colour palette and sunburst style. Do not copy its text or layout.\n\nScene: ${prompt}` },
          { inlineData: { mimeType: 'image/jpeg', data: ref } },
        ] }],
        generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio, imageSize: '2K' } },
      }),
    });
    const json = await res.json();
    const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!part) throw new Error(`${res.status} ${json.error?.message || json.candidates?.[0]?.finishReason || ''}`);
    return Buffer.from(part.inlineData.data, 'base64');
  },
  // Not yet run against the live API from here: check the first result before making a batch.
  async grok(prompt, aspectRatio) {
    const res = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.GROK_MODEL || 'grok-imagine-image', prompt: `${STYLE}\n\nScene: ${prompt}`, n: 1, aspect_ratio: aspectRatio, response_format: 'b64_json' }),
    });
    const json = await res.json();
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) throw new Error(`${res.status} ${json.error?.message || json.error || ''}`);
    return Buffer.from(b64, 'base64');
  },
};

async function make(name, prompt, aspectRatio) {
  const out = `${dir}${name}.png`;
  if (existsSync(out) && !only.length) return console.log('skip', name);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      writeFileSync(out, await providers[provider](prompt, aspectRatio));
      return console.log('ok  ', name, `(${provider})`);
    } catch (e) {
      console.log('retry', name, attempt, String(e.message).slice(0, 120));
      await new Promise((r) => setTimeout(r, 4000 * attempt));
    }
  }
  console.log('FAIL', name);
}

const jobs = Object.entries(art).flatMap(([name, a]) => (a.ratios || ['4:5', '9:16']).map((r) => [`${name}-${r.replace(':', 'x')}`, a.prompt, r]));
const todo = only.length ? jobs.filter(([n]) => only.some((o) => n.startsWith(o))) : jobs;
for (let i = 0; i < todo.length; i += 3) await Promise.all(todo.slice(i, i + 3).map((j) => make(...j)));
