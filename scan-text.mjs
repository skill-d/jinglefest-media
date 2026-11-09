// Asks a Gemini vision model whether a scene contains stray lettering.
import { readdirSync, readFileSync } from 'node:fs';
const dir = new URL('./art/', import.meta.url).pathname;
const files = readdirSync(dir).filter((f) => f.endsWith('.png'));
const ask = async (f) => {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', { method: 'POST', headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: 'Look very closely. Does this illustration contain any letters, digits, words, pseudo-text, logos or anything resembling writing, including tiny text on signs, awnings, clothing, clock faces or banners? Reply as JSON: {"text":true|false,"where":"short description or empty"}' }, { inlineData: { mimeType: 'image/png', data: readFileSync(dir + f).toString('base64') } }] }], generationConfig: { responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } } }) });
  const j = await res.json(); return [f, j.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(j.error?.message)];
};
for (let i = 0; i < files.length; i += 7) for (const [f, r] of await Promise.all(files.slice(i, i + 7).map(ask))) console.log(f.padEnd(22), r.replace(/\s+/g, ' ').slice(0, 130));
