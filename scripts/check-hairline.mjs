import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../public/hairline/document-tray.js', import.meta.url), 'utf8');
const nodes = [];
let handlers, tick;
function node(attrs = {}) {
  const classes = new Set((attrs.class || '').split(/\s+/).filter(Boolean));
  const result = { attrs, children: [], setAttribute(k, v) { this.attrs[k] = v; }, classList: { toggle(name, on) { on ? classes.add(name) : classes.delete(name); }, contains(name) { return classes.has(name); } } };
  nodes.push(result); return result;
}
const HL = {
  Cam: () => ({}), clamp: Math.max, fit() {}, facing: () => () => true, fillet: p => p, hull: p => p,
  open: () => '', poly: () => '', proj: () => (x, y) => [x + 200, y + 166], rad: x => x * Math.PI / 180,
  ringAt: () => [[0, 0], [1, 0]], rrect: () => [[0, 0], [1, 0]], run: (p, f) => p, seg: () => '', disposer: () => ({ add() {}, dispose() {} }),
  mk: (tag, attrs, parent) => { const n = node(attrs); if (parent?.children) parent.children.push(n); return n; },
  pointer: (_stage, h) => { handlers = h; return {}; }, register: (_stage, fn) => { tick = fn; return { unregister() {}, wake() {} }; },
  tween: x => ({ x, t: x }), tset: (o, x) => { o.x = x; o.t = x; }, tval: o => o.x, tdone: () => true,
};
let figure;
vm.runInNewContext(source, { HL, hairline: value => { figure = value; }, performance: { now: () => 0 }, Math, String });
const svg = node(), read = { textContent: '' };
figure.mount({ stage: {}, svg, read }, 35);
tick(0, 0);
const sheets = nodes.filter(n => n.attrs.class === 'sil' || n.attrs.class === 'sil hi').slice(1);
assert.equal(sheets.length, 5, 'mock should capture five sheet silhouettes');
const bright = () => sheets.map((n, i) => n.classList.contains('hi') ? i : -1).filter(i => i >= 0);
assert.deepEqual(bright(), [2], 'initial rest mark should be the composed middle sheet');
handlers.move([238, 212]);
assert.deepEqual(bright(), [4], 'pointer selection should transfer the highlight to one sheet');
handlers.leave();
assert.deepEqual(bright(), [2], 'leave should restore the single rest mark');

const { mountHairlineIllustrations } = await import('../src/components/home/services/hairline-scroll.mjs');
const { createServiceArtwork } = await import('../src/components/home/services/service-artwork.mjs');
const adapterSource = await readFile(new URL('../src/components/home/services/hairline-scroll.mjs', import.meta.url), 'utf8');
const artworkSource = await readFile(new URL('../src/components/home/services/service-artwork.mjs', import.meta.url), 'utf8');
const serviceSource = await readFile(new URL('../src/components/home/services/Services.astro', import.meta.url), 'utf8');
const illustrationSource = await readFile(new URL('../src/components/home/services/ServiceIllustration.astro', import.meta.url), 'utf8');
const paymentRest = await readFile(new URL('../public/hairline/bookings-payments-rest.svg', import.meta.url), 'utf8');
const maintenanceRest = await readFile(new URL('../public/hairline/maintenance-rest.svg', import.meta.url), 'utf8');
const contractFailures = [];
const expectContract = (condition, description) => { if (!condition) contractFailures.push(description); };
const nativeHostTag = illustrationSource.match(/<div class="hairline-host"[^>]*>/)?.[0] || '';
expectContract(nativeHostTag.includes('data-hairline-host') && nativeHostTag.includes('--hairline-plate:#18181b') && nativeHostTag.includes('--hairline-hi:#4ade80') && nativeHostTag.includes('--hairline-edge:#789b7f'), 'palette is set on the actual Hairline host');
const headingTag = illustrationSource.match(/<h3[^>]*>/)?.[0] || '';
expectContract(headingTag.includes('style="color:#fafafa"'), 'service heading directly sets its foreground against the inherited page color');
const cardRestTransform = paymentRest.match(/<g data-art="payment-card" transform="([^"]+)"/)?.[1] || '';
const wrenchRestTransform = maintenanceRest.match(/<g data-art="adjustment-wrench" transform="([^"]+)"/)?.[1] || '';
const transformNumbers = value => [...value.matchAll(/-?\d+(?:\.\d+)?/g)].map(match => Number(match[0]));
expectContract(JSON.stringify(transformNumbers(cardRestTransform)) === JSON.stringify([159, 286, 0]), 'POS card moves level across the upright reader slot');
expectContract(JSON.stringify(transformNumbers(wrenchRestTransform)) === JSON.stringify([433, 86, 0, 32, 48]), 'wrench pivots beside the fixed editor window');
expectContract(/data-art="payment-screen">\s*<rect[^>]*rx="(?:8|9|10)"/.test(paymentRest) && /data-art="editor-window"[^>]*>[\s\S]*<rect[^>]*rx="(?:8|9|10)"/.test(maintenanceRest), 'POS and editor use rounded front-facing screens');
expectContract(/playOnVisible|play:\s*true/.test(serviceSource), 'native Hairline tour launch option');
expectContract(!adapterSource.includes('scrollProgress') && !adapterSource.includes("addEventListener('scroll'") && !adapterSource.includes('addEventListener("scroll"'), 'absence of scroll-only illustration motion');
expectContract(/requestAnimationFrame/.test(artworkSource) && /visibilitychange/.test(artworkSource), 'owned time scheduler with hidden-document pause');
expectContract(paymentRest.includes('data-art="payment-card"') && /keypad|payment-keypad/i.test(paymentRest), 'moving POS card and recognizable keypad geometry');
expectContract(maintenanceRest.includes('data-art="editor-window"') && maintenanceRest.includes('data-art="adjustment-wrench"'), 'editor window and adjustment wrench moving groups');
expectContract(/--hairline-hi:\s*#4ade80/i.test(illustrationSource), 'green Hairline active-stroke token');
for (const asset of ['web-app-rest.svg', 'integrations-rest.svg', 'automation-rest.svg', 'bookings-payments-rest.svg', 'dashboard-rest.svg', 'maintenance-rest.svg']) {
  const markup = await readFile(new URL(`../public/hairline/${asset}`, import.meta.url), 'utf8');
  expectContract(markup.includes('#4ade80'), `${asset} green fallback accent`);
}
assert.deepEqual(contractFailures, [], `required ambient/native-play/moving-group/green contract failures: ${contractFailures.join('; ')}`);
assert.equal(typeof mountHairlineIllustrations, 'function', 'service figures need one lifecycle adapter');
const servicesSource = await readFile(new URL('../src/components/home/services/Services.astro', import.meta.url), 'utf8');
const cardSource = await readFile(new URL('../src/components/home/services/ServiceIllustration.astro', import.meta.url), 'utf8');
assert.match(servicesSource, /import \{\s*exploded,\s*patch,\s*slow,\s*terminal\s*\}/, 'only appropriate figures use native Hairline renderers');
assert.ok(!/\b(phone|rebuild)\b/.test(servicesSource), 'rejected phone and dependency-tree figures must not reach production');
assert.ok(servicesSource.includes('gateway:') && servicesSource.includes('maintenance:'), 'payment gateway and maintenance use authored artwork renderers');
assert.match(servicesSource, /playOnVisible|play:\s*true/, 'native tour figures must use Hairline’s documented play option');
assert.match(cardSource, /--hairline-hi:\s*#4ade80/i, 'native active strokes use the site green accent');
assert.match(cardSource, /--hairline-plate:\s*#18181b/i, 'Hairline plate matches its dark card surface');

function parseAuthoredSvg(markup) {
  const groups = new Map();
  for (const match of markup.matchAll(/<g\b([^>]*data-art="([^"]+)"[^>]*)>/g)) {
    const attrs = Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map((entry) => [entry[1], entry[2]]));
    groups.set(match[2], { attrs, getAttribute(key) { return this.attrs[key] ?? null; }, setAttribute(key, value) { this.attrs[key] = value; } });
  }
  return { localName: 'svg', attrs: {}, groups, setAttribute(key, value) { this.attrs[key] = value; }, querySelector(selector) { return this.groups.get(selector.match(/data-art="([^"]+)"/)[1]) || null; }, remove() { this.parentNode?.children.splice(this.parentNode.children.indexOf(this), 1); } };
}
function makeSvgHost() {
  return { children: [{ id: 'unowned' }], appendChild(node) { node.parentNode = this; this.children.push(node); } };
}
function makeTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    contains(node) { return node === this; },
    emit(type, relatedTarget = null) { for (const fn of [...(listeners.get(type) || [])]) fn({ relatedTarget }); },
    count() { return [...listeners.values()].reduce((sum, group) => sum + group.size, 0); },
  };
}
function makeEnvironment(reduced = false) {
  let next = 0;
  const frames = new Map(), listeners = new Map(), mediaListeners = new Set(), observed = [], documentListeners = new Map();
  const media = { matches: reduced, addEventListener: (_type, fn) => mediaListeners.add(fn), removeEventListener: (_type, fn) => mediaListeners.delete(fn), change(matches) { this.matches = matches; for (const fn of [...mediaListeners]) fn({ matches }); } };
  const documentRef = { hidden: false, addEventListener(type, fn) { if (!documentListeners.has(type)) documentListeners.set(type, new Set()); documentListeners.get(type).add(fn); }, removeEventListener(type, fn) { documentListeners.get(type)?.delete(fn); }, emit(type) { for (const fn of [...(documentListeners.get(type) || [])]) fn(); }, listenerCount() { return [...documentListeners.values()].reduce((sum, group) => sum + group.size, 0); } };
  const win = {
    matchMedia: () => media,
    requestAnimationFrame(fn) { const id = ++next; frames.set(id, fn); return id; }, cancelAnimationFrame(id) { frames.delete(id); },
    addEventListener(type, fn) { listeners.set(type, fn); }, removeEventListener(type, fn) { listeners.delete(type); },
    flush(time) { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(time)); },
  };
  let intersection;
  const observerFactory = callback => (intersection = { observe(target) { observed.push(target); }, disconnect() { this.disconnected = true; }, emit(target, value) { callback([{ target, isIntersecting: value }]); } });
  return { win, media, documentRef, listeners, documentListeners, mediaListeners, frames, observed, observerFactory, get observer() { return intersection; } };
}
function makeCard(type, label = `${type} illustration`) {
  const wrapper = { dataset: {}, style: { removeProperty() {} } };
  return { type, label, playOnVisible: ['exploded', 'patch', 'terminal'].includes(type), authoredMotion: ['gateway', 'maintenance'].includes(type), interactionTarget: { type: `${type}-card` }, wrapper, host: { dataset: { label } } };
}
const settle = async () => { await Promise.resolve(); await Promise.resolve(); };

// Verify public Hairline playback options and visible-only lifecycle without mocking its private engine.
{
  const env = makeEnvironment(), cards = ['exploded', 'patch', 'slow', 'gateway', 'terminal', 'maintenance'].map(type => makeCard(type));
  const calls = [], destroyed = [], updates = [];
  const renderers = Object.fromEntries(cards.map(({ type }) => [type, (host, options) => {
    calls.push({ type, host, options });
    return { update(options) { updates.push({ type, options }); }, destroy() { destroyed.push(type); } };
  }]));
  const stop = mountHairlineIllustrations({ items: cards, renderers, win: env.win, documentRef: env.documentRef, observerFactory: env.observerFactory });
  const duplicateStop = mountHairlineIllustrations({ items: cards, renderers, win: env.win, documentRef: env.documentRef, observerFactory: env.observerFactory });
  assert.equal(env.frames.size, 0, 'the observer adapter must not create a scroll animation loop');
  assert.equal(env.observed.length, 6, 'one observer tracks each service illustration');
  env.observer.emit(cards[0].wrapper, true); env.observer.emit(cards[2].wrapper, true); await settle();
  assert.deepEqual(calls.map(call => call.type).sort(), ['exploded', 'slow'], 'visible native figures mount without eagerly mounting offscreen cards');
  assert.equal(calls.find(call => call.type === 'exploded').options.play, true, 'public Hairline play tour runs while visible');
  assert.ok(!('play' in calls.find(call => call.type === 'slow').options), 'slow keeps its documented native ambient/hover behavior');
  env.observer.emit(cards[0].wrapper, false);
  assert.ok(updates.some(update => update.type === 'exploded' && update.options.play === false), 'native tour pauses through the public API offscreen');
  env.observer.emit(cards[0].wrapper, true);
  assert.ok(updates.some(update => update.type === 'exploded' && update.options.play === true), 'native tour resumes through the public API on visibility');
  assert.ok(!updates.some(update => update.type === 'slow' && 'play' in update.options), 'slow is never assumed to pause via play:false');
  for (const card of cards.slice(1)) env.observer.emit(card.wrapper, true);
  await settle();
  assert.equal(calls.length, 6, 'all six documented renderer types mount independently');
  for (const call of calls) {
    if (['gateway', 'maintenance'].includes(call.type)) assert.equal(call.options.interactionTarget, cards.find(card => card.type === call.type).interactionTarget, `${call.type} forwards its card interaction target`);
    else assert.ok(!('interactionTarget' in call.options), `${call.type} native renderer receives no unsupported interaction target`);
  }
  env.documentRef.hidden = true; env.documentRef.emit('visibilitychange');
  assert.ok(updates.some(update => update.type === 'terminal' && update.options.play === false), 'native tours pause while the document is hidden');
  env.documentRef.hidden = false; env.documentRef.emit('visibilitychange');
  assert.ok(updates.some(update => update.type === 'terminal' && update.options.play === true), 'visible native tours resume when the document becomes visible');
  assert.equal(updates.filter(update => update.type === 'slow' && 'play' in update.options).length, 0, 'the ambient slow figure is left to Hairline’s documented offscreen loop');
  env.media.change(true);
  assert.equal(cards[0].wrapper.dataset.ready, undefined, 'reduced motion restores the static fallback');
  assert.equal(destroyed.length, 6, 'reduced motion destroys mounted figures');
  env.media.change(false); await settle();
  assert.equal(calls.length, 12, 'returning to motion remounts currently visible figures');
  stop(); duplicateStop();
  assert.equal(env.observer.disconnected, true, 'teardown disconnects the observer');
  assert.equal(env.listeners.size, 0, 'teardown does not leave window listeners');
  assert.equal(env.mediaListeners.size, 0, 'teardown removes reduced-motion listener');
  assert.equal(env.documentRef.listenerCount(), 0, 'teardown removes document visibility listener');
  assert.equal(destroyed.length, 12, 'teardown destroys each live renderer once');
}

// The authored SVG scheduler must progress by time, not scroll, and pause under all inactive states.
{
  const env = makeEnvironment(), paymentHost = makeSvgHost(), editorHost = makeSvgHost();
  const paymentTarget = makeTarget(), editorTarget = makeTarget();
  const paymentSvg = await readFile(new URL('../public/hairline/bookings-payments-rest.svg', import.meta.url), 'utf8');
  const editorSvg = await readFile(new URL('../public/hairline/maintenance-rest.svg', import.meta.url), 'utf8');
  const payment = await createServiceArtwork(paymentHost, { type: 'gateway', label: 'Card passing a POS terminal', src: '/hairline/bookings-payments-rest.svg', loadSvg: async () => paymentSvg, parse: parseAuthoredSvg, win: env.win, documentRef: env.documentRef, interactionTarget: paymentTarget });
  const editor = await createServiceArtwork(editorHost, { type: 'maintenance', label: 'Code editor with adjustment wrench', src: '/hairline/maintenance-rest.svg', loadSvg: async () => editorSvg, parse: parseAuthoredSvg, win: env.win, documentRef: env.documentRef, interactionTarget: editorTarget });
  const paymentRoot = paymentHost.children[1], editorRoot = editorHost.children[1];
  assert.equal(paymentRoot.attrs.role, 'img', 'owned SVG exposes image semantics');
  assert.equal(paymentRoot.attrs['aria-label'], 'Card passing a POS terminal', 'localized accessible labels reach the authored renderer');
  assert.equal(paymentRoot.attrs.width, '100%', 'authored SVG fills its bounded art region');
  const card = paymentRoot.querySelector('[data-art="payment-card"]');
  const wrench = editorRoot.querySelector('[data-art="adjustment-wrench"]');
  const cardRest = card.getAttribute('transform'), wrenchRest = wrench.getAttribute('transform');
  const transformNumbers = value => [...value.matchAll(/-?\d+(?:\.\d+)?/g)].map(match => Number(match[0]));
  const paymentFallback = parseAuthoredSvg(paymentSvg).querySelector('[data-art="payment-card"]');
  const editorFallback = parseAuthoredSvg(editorSvg).querySelector('[data-art="adjustment-wrench"]');
  assert.deepEqual(transformNumbers(cardRest), transformNumbers(paymentFallback.getAttribute('transform')), 'payment animation rests on the matching static-card composition');
  assert.deepEqual(transformNumbers(wrenchRest), transformNumbers(editorFallback.getAttribute('transform')), 'wrench animation rests on the matching static-editor composition');
  payment.update({ visible: true }); editor.update({ visible: true });
  assert.equal(env.frames.size, 1, 'both owned illustrations share one page scheduler');
  env.win.flush(0); env.win.flush(1500);
  const cardEntry = card.getAttribute('transform');
  assert.notEqual(cardEntry, cardRest, 'payment card advances from elapsed visible time without scroll');
  env.win.flush(4500);
  assert.notEqual(card.getAttribute('transform'), cardEntry, 'payment card passes through distinct authored phases');
  assert.notEqual(wrench.getAttribute('transform'), wrenchRest, 'wrench adjusts through its own authored cycle');
  editor.update({ visible: false });
  paymentTarget.emit('pointerenter');
  for (let time = 4700; time <= 7500 && env.frames.size; time += 200) env.win.flush(time);
  const eased = card.getAttribute('transform');
  const cardX = Number(eased.match(/translate\(([\d.]+)/)[1]);
  assert.ok(Math.abs(cardX - 159) < 0.3, 'hover eases the card to its readable selected position');
  assert.equal(env.frames.size, 0, 'settled hover stops the owned animation loop');
  paymentTarget.emit('pointerleave');
  env.win.flush(8000); env.win.flush(8300);
  assert.notEqual(card.getAttribute('transform'), eased, 'leaving hover resumes the periodic cycle');
  payment.update({ visible: false }); editor.update({ visible: true });
  editorTarget.emit('focusin');
  for (let time = 8600; time <= 11500 && env.frames.size; time += 200) env.win.flush(time);
  const focused = wrench.getAttribute('transform');
  assert.equal(env.frames.size, 0, 'settled keyboard focus pauses the owned animation loop');
  editorTarget.emit('focusout', {});
  env.win.flush(11800); env.win.flush(12100);
  assert.notEqual(wrench.getAttribute('transform'), focused, 'focus leaving the card resumes its cycle');
  payment.update({ visible: false }); editor.update({ visible: false });
  assert.equal(env.frames.size, 0, 'offscreen owned art cancels the shared frame');
  payment.update({ visible: true }); editor.update({ visible: true });
  env.documentRef.hidden = true; env.documentRef.emit('visibilitychange');
  assert.equal(env.frames.size, 0, 'hidden documents cancel owned animation frames');
  env.documentRef.hidden = false; env.documentRef.emit('visibilitychange');
  assert.equal(env.frames.size, 1, 'visible documents resume active owned art');
  env.media.change(true);
  assert.equal(env.frames.size, 0, 'reduced-motion preference stops authored animation');
  env.media.change(false);
  assert.equal(env.frames.size, 1, 'motion preference returning resumes visible authored art');
  payment.destroy(); payment.destroy(); editor.destroy();
  assert.equal(env.frames.size, 0, 'destroy cancels the last shared frame');
  assert.equal(paymentTarget.count(), 0, 'destroy removes pointer and focus handlers');
  assert.equal(editorTarget.count(), 0, 'each renderer removes its own interaction handlers');
  assert.equal(env.mediaListeners.size, 0, 'destroy removes per-renderer motion listeners');
  assert.equal(env.documentRef.listenerCount(), 0, 'destroy removes per-renderer visibility listeners');
  assert.deepEqual(paymentHost.children.map(node => node.id), ['unowned'], 'payment cleanup removes only its own SVG');
  assert.deepEqual(editorHost.children.map(node => node.id), ['unowned'], 'editor cleanup removes only its own SVG');
}

// Mount failures, late async results and duplicate lifecycles keep the static fallback usable.
{
  const env = makeEnvironment(), failedCard = makeCard('gateway'), lateCard = makeCard('patch');
  let resolveRenderer, destroyCount = 0;
  const stop = mountHairlineIllustrations({ items: [failedCard], renderers: { gateway: () => Promise.reject(new Error('simulated renderer failure')) }, win: env.win, documentRef: env.documentRef, observerFactory: env.observerFactory });
  env.observer.emit(failedCard.wrapper, true); await settle();
  assert.equal(failedCard.wrapper.dataset.ready, undefined, 'failed mount leaves static fallback visible');
  stop();
  const brokenUpdate = makeCard('gateway'); let brokenDestroyCount = 0;
  const brokenStop = mountHairlineIllustrations({ items: [brokenUpdate], renderers: { gateway: () => ({ update() { throw new Error('invalid authored group'); }, destroy() { brokenDestroyCount++; } }) }, win: env.win, documentRef: env.documentRef, observerFactory: env.observerFactory });
  env.observer.emit(brokenUpdate.wrapper, true); await settle();
  assert.equal(brokenDestroyCount, 1, 'a renderer that fails on its visible update is destroyed');
  assert.equal(brokenUpdate.wrapper.dataset.ready, undefined, 'failed authored update restores the static fallback');
  brokenStop();
  const lateStop = mountHairlineIllustrations({ items: [lateCard], renderers: { patch: () => new Promise(resolve => { resolveRenderer = resolve; }) }, win: env.win, documentRef: env.documentRef, observerFactory: env.observerFactory });
  env.observer.emit(lateCard.wrapper, true); await settle();
  lateStop(); resolveRenderer({ destroy() { destroyCount++; } }); await settle();
  assert.equal(destroyCount, 1, 'a renderer resolving after teardown is destroyed immediately');
  assert.equal(lateCard.wrapper.dataset.ready, undefined, 'late result cannot hide the fallback');
}

// Each fallback carries the shared green/neutral system and the selected semantic objects.
{
  const assets = ['web-app-rest.svg', 'integrations-rest.svg', 'automation-rest.svg', 'bookings-payments-rest.svg', 'dashboard-rest.svg', 'maintenance-rest.svg'];
  for (const asset of assets) {
    const markup = await readFile(new URL(`../public/hairline/${asset}`, import.meta.url), 'utf8');
    assert.match(markup, /viewBox="0 0 640 512"/, `${asset} preserves the 5:4 frame`);
    assert.match(markup, /#4ade80/i, `${asset} uses the site green accent`);
    assert.ok(!markup.includes('stroke="#fafafa" stroke-width="4"'), `${asset} uses green rather than a dominant white highlight`);
  }
  const payment = await readFile(new URL('../public/hairline/bookings-payments-rest.svg', import.meta.url), 'utf8');
  assert.ok(payment.includes('data-art="payment-reader"') && payment.includes('data-art="payment-card"'), 'POS fallback includes the terminal and moving thin card');
  assert.match(payment, /keypad|payment-keypad/i, 'POS terminal is recognizable through its keypad geometry');
  const maintenance = await readFile(new URL('../public/hairline/maintenance-rest.svg', import.meta.url), 'utf8');
  assert.ok(maintenance.includes('data-art="editor-window"') && maintenance.includes('data-art="adjustment-wrench"'), 'maintenance fallback includes editor and wrench');
  assert.match(maintenance, /stroke-linecap="round"/, 'tool geometry has rounded stroke ends');
}
