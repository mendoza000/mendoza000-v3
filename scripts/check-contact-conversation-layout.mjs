import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const [host, figure, rest] = await Promise.all([
  readFile(new URL('src/components/home/contact/ContactIllustration.astro', root), 'utf8'),
  readFile(new URL('conversation.js', root), 'utf8'),
  readFile(new URL('odd/evidence/contact-laptop-conversation/rest.svg', root), 'utf8'),
]);
assert.match(host, /width:\s*100%/);
assert.match(host, /aspect-ratio:\s*16\/10/);
assert.match(host, /overflow:\s*hidden/);
assert.match(host, /width:\s*100%;aspect-ratio:5\/4/);
assert.match(host, /aria-live="off"/);
const frame = figure.match(/const FRAME = \{ x: (\d+), y: (\d+), w: (\d+), h: (\d+) \}/);
assert.ok(frame, 'native 400 × 320 screen frame is explicit');
const [, ...dimensions] = frame;
const [x, y, w, h] = dimensions.map(Number);
assert.ok(x >= 0 && y >= 0 && x + w <= 400 && y + h <= 250, 'frame fits the visible 16:10 crop without altering native SVG coordinates');
const messages = [...figure.matchAll(/\{ x: (\d+), y: (\d+), w: (\d+), h: (\d+), bars: \[(\d+), (\d+)\], side: '(in|out|reply)' \}/g)];
assert.equal(messages.length, 5, 'exactly five authored message rows');
for (const [, mx, my, mw, mh, ...rest] of messages) {
  const [a, b] = rest.slice(0, 2).map(Number);
  assert.ok(Number(mx) >= x && Number(mx) + Number(mw) <= x + w, 'message remains within screen frame');
  assert.ok(Number(my) >= y && Number(my) + Number(mh) <= 215, 'message remains clear of header, typing and composer');
  assert.ok(a > 0 && b > 0 && Math.max(a, b) < Number(mw) - 12, 'varied message bars have internal margins');
}
const exportedBubbles = [...rest.matchAll(/<path\b([^>]+)>/g)].map(([, attrs]) => {
  const part = attrs.match(/\bdata-part="(message-[1-5]-(?:in|out|reply))"/)?.[1];
  const d = attrs.match(/\bd="([^"]+)"/)?.[1];
  if (!part || !d) return null;
  const points = [...d.matchAll(/[ML](-?(?:\d+\.?\d*|\.\d+))\s+(-?(?:\d+\.?\d*|\.\d+))/g)].map(([, px, py]) => [Number(px), Number(py)]);
  assert.ok(points.length >= 4, `${part}: exported bubble path should have measurable points`);
  const xs = points.map(([px]) => px);
  return { part, minX: Math.min(...xs), maxX: Math.max(...xs) };
}).filter(Boolean).sort((a, b) => Number(a.part.match(/message-(\d)/)[1]) - Number(b.part.match(/message-(\d)/)[1]));
assert.equal(exportedBubbles.length, 5, 'actual exported rest must contain five measurable message bubbles');
const visualSides = exportedBubbles.map(({ minX, maxX }) => {
  if (Math.abs(minX - 23) <= 1) return 'left';
  if (Math.abs(maxX - 376) <= 1) return 'right';
  return 'unanchored';
});
assert.deepEqual(visualSides, ['right', 'left', 'right', 'left', 'right'], `actual exported message bbox anchors must alternate R/L/R/L/R; observed ${visualSides.join('/')} from ${JSON.stringify(exportedBubbles)}`);
console.log('Contact conversation native layout, crop, and exported alternation contracts passed');
