import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const [figure,page,host,adapter,contact,kernelSource,kernel,runtime,rest,exported] = await Promise.all([
  read('../conversation.js'),read('../hairline-conversation.html'),read('../src/components/home/contact/ContactIllustration.astro'),
  read('../src/components/home/contact/contact-illustration.mjs'),read('../src/components/home/contact/Contact.astro'),
  read('../.agents/skills/hairline-create/kernel.js'),read('../public/hairline/contact-conversation-kernel.mjs'),
  read('../public/hairline/contact-conversation-figure.mjs'),read('../public/hairline/contact-conversation-rest.svg'),
  read('../odd/evidence/contact-laptop-conversation/rest.svg'),
]);
assert.match(host,/Frontal conversation window with five messages/);
assert.match(host,/Ventana de conversación frontal con cinco mensajes/);
assert.match(host,/aria-live="off"/);assert.match(host,/locale === 'es' \? 'en reposo' : 'rest'/);
assert.doesNotMatch(host,/laptop|portátil|persona|program/i);assert.doesNotMatch(host,/<form\b|<input\b/i);assert.match(host,/data-conversation-window/);
assert.match(figure,/FRAME = \{ x: 8, y: 8, w: 384, h: 240 \}/);
assert.equal((figure.match(/side: '(?:in|out|reply)'/g)||[]).length,5,'five alternating message bubbles');
assert.match(figure,/message-\$\{index \+ 1\}-\$\{m\.side\}/);assert.match(figure,/composer-send/);assert.match(figure,/typing-dot/);
assert.doesNotMatch(figure,/laptop|keyboard|trackpad|hinge|person|desk|chair|<text\b|foreignObject/i);
assert.match(figure,/register\(stage,\s*\(dt,\s*now\)/);
assert.match(figure,/tset\(/);assert.match(figure,/tval\(/);
assert.doesNotMatch(figure,/Date\(|performance\.now|requestAnimationFrame|setTimeout|setInterval|new Function|eval\(|opacity|style/);
assert.match(figure,/pointer\(stage/);assert.match(figure,/set:\s*v\s*=>/);
assert.match(adapter,/IntersectionObserver/);assert.match(adapter,/prefers-reduced-motion/);assert.match(adapter,/document\.hidden/);assert.match(adapter,/destroy\(/);
assert.match(adapter,/media\.matches\?0:\.5/);assert.match(contact,/ContactIllustration locale=\{locale\}/);assert.doesNotMatch(contact,/ContactEnvelope|contact-envelope/);
assert.equal(kernel,kernelSource+'\nexport default HL;\n','runtime kernel is frozen bytes plus export shim');
assert.equal(runtime.split(figure).length,2,'runtime embeds exact canonical source once');
const elements=text=>[...text.matchAll(/<(path|circle)\b([^>]*?)(?:\s*\/?>)/g)].map(m=>`${m[1]} ${m[2].replace(/\s+/g,' ').trim()}`);
assert.deepEqual(elements(rest),elements(exported),'fallback elements, geometry, classes and attributes exactly match mounted rest export');
assert.match(rest,/^<svg\b[^>]*viewBox="0 0 400 320"/);assert.match(rest,/#[0-9a-fA-F]{6}/);
const standalone=page.match(/<script type="module" id="hl-figure">\n([\s\S]*?)\n<\/script>/)?.[1];
assert.ok(standalone?.includes(figure.trim()),'standalone embeds authored source');
assert.match(page,/name:\s*'conversation'/);
console.log('Contact conversation contracts passed');
