import HL from './contact-conversation-kernel.mjs';
let definition;
const hairline = value => { definition = value; };
const { clamp, fillet, poly, tween, tset, tval, disposer, mk, register, pointer } = HL;
const FRAME = { x: 8, y: 8, w: 384, h: 240 };
const messages = [
  { x: 166, y: 55, w: 210, h: 27, bars: [108, 72], side: 'out' },
  { x: 23, y: 87, w: 226, h: 27, bars: [137, 91], side: 'in' },
  { x: 134, y: 119, w: 242, h: 27, bars: [156, 84], side: 'out' },
  { x: 23, y: 151, w: 247, h: 27, bars: [92, 168], side: 'in' },
  { x: 84, y: 183, w: 292, h: 28, bars: [194, 127], side: 'reply' },
];
function mount({ stage, svg, read }, value) {
  const bag = disposer(), group = mk('g', { 'data-part': 'conversation-window' }, svg);
  const path = (d, cls = 'sil', part) => mk('path', { d, class: cls, ...(part ? { 'data-part': part } : {}) }, group);
  const line = (x1, y1, x2, y2, cls = 'nf lo', part) => path(`M${x1} ${y1}L${x2} ${y2}`, cls, part);
  const box = (x, y, w, h, r, cls = 'sil', part) => path(poly(fillet([[x,y],[x+w,y],[x+w,y+h],[x,y+h]], [r,r,r,r], 5)), cls, part);
  const circle = (cx, cy, r, cls = 'dot off', part) => mk('circle', { cx, cy, r, class: cls, ...(part ? { 'data-part': part } : {}) }, group);
  box(FRAME.x, FRAME.y, FRAME.w, FRAME.h, 13, 'sil', 'screen-frame');
  box(14, 14, 372, 228, 9, 'nf lo', 'screen-inset');
  line(15, 43, 385, 43, 'nf lo', 'header-divider');
  circle(31, 28, 7, 'dot m', 'header-avatar');
  line(45, 24, 94, 24, 'nf lo', 'header-title-bar');
  line(45, 32, 76, 32, 'nf lo', 'header-subtitle-bar');
  circle(365, 27, 1.6, 'dot m', 'header-menu-dot');
  circle(373, 27, 1.6, 'dot m', 'header-menu-dot');
  circle(381, 27, 1.6, 'dot m', 'header-menu-dot');
  const entries = messages.map((m, index) => {
    const bubble = box(m.x, m.y, m.w, m.h, 7, index === 4 ? 'hi' : 'sil', `message-${index + 1}-${m.side}`);
    const bars = m.bars.map((length, row) => line(m.x + 10, m.y + 9 + row * 9, m.x + 10 + length, m.y + 9 + row * 9, index === 4 ? 'nf hi' : 'nf lo', `message-${index + 1}-bar`));
    return { bubble, bars, message: m };
  });
  const typing = [circle(43, 218, 2, 'dot off', 'typing-dot'), circle(52, 218, 2, 'dot off', 'typing-dot'), circle(61, 218, 2, 'dot off', 'typing-dot')];
  box(23, 222, 353, 14, 6, 'nf lo', 'composer');
  circle(34, 229, 3, 'dot m', 'composer-add');
  line(34, 226, 34, 232, 'nf lo', 'composer-add-glyph');
  line(31, 229, 37, 229, 'nf lo', 'composer-add-glyph');
  line(55, 229, 140, 229, 'nf lo', 'composer-placeholder-bar');
  box(355, 224, 17, 10, 3, 'sil', 'composer-send');
  line(360, 229, 367, 229, 'nf lo', 'composer-send-glyph');
  line(364, 226, 367, 229, 'nf lo', 'composer-send-glyph');
  line(364, 232, 367, 229, 'nf lo', 'composer-send-glyph');

  if (!read.textContent) read.textContent = 'rest';
  const arrival = tween(value === 0 ? 1 : 0);
  let settled = value === 0, hovering = false;
  let phaseStart = null, phase = settled ? 2 : 0, lastArrival = -1, lastTyping = -1, lastNow = 0;
  const draw = (now, force = false) => {
    lastNow = now;
    const progress = settled ? 1 : tval(arrival, now);
    const visibleTyping = !settled && phase === 0;
    const dotPhase = visibleTyping ? Math.floor(now / 260) % 4 : -1;
    if (force || progress !== lastArrival) {
      const m = messages[4], shift = (1 - progress) * 15, width = m.w * (0.82 + progress * 0.18);
      entries[4].bubble.setAttribute('d', poly(fillet([[m.x + shift,m.y],[m.x + shift + width,m.y],[m.x + shift + width,m.y + m.h],[m.x + shift,m.y + m.h]], [7,7,7,7], 5)));
      entries[4].bars.forEach((el, i) => { const length = m.bars[i] * progress, y = m.y + 9 + i * 9; el.setAttribute('d', `M${m.x + shift + 10} ${y}L${m.x + shift + 10 + length} ${y}`); });
      lastArrival = progress;
    }
    if (force || dotPhase !== lastTyping) {
      typing.forEach((dot, i) => dot.setAttribute('class', settled || dotPhase === i ? 'dot m' : 'dot off'));
      lastTyping = dotPhase;
    }
  };
  const board = register(stage, (dt, now) => {
    if (settled) { draw(now); return false; }
    if (phaseStart === null) { phaseStart = now; phase = 0; tset(arrival, 0, now, 0); }
    const elapsed = now - phaseStart;
    if (phase === 0 && elapsed >= 1500) { phase = 1; tset(arrival, 1, now, 0); }
    else if (phase === 1 && elapsed >= 2700) { phase = 2; }
    else if (phase === 2 && elapsed >= 5200) { phase = 0; phaseStart = now; }
    draw(now);
    return true;
  });
  const hit = ([x, y]) => x >= 15 && x <= 385 && y >= 44 && y <= 215;
  bag.add(pointer(stage, {
    move: point => {
      const over = hit(point);
      if (over && !hovering && !settled) {
        hovering = true; phase = 0; phaseStart = lastNow;
        tset(arrival, 0, lastNow, 0); board.wake();
      } else if (!over) hovering = false;
    },
    leave: () => { hovering = false; },
  }));
  draw(0, true);
  bag.add(board.unregister);
  bag.add(() => svg.replaceChildren());
  return { set: v => {
    value = clamp(v, 0, 1); settled = value === 0;
    if (settled) { phase = 2; tset(arrival, 1, lastNow, 0); }
    else { phase = 0; phaseStart = lastNow; tset(arrival, 0, lastNow, 0); }
    board.wake();
  }, destroy: bag.dispose };
}
hairline({ name: 'conversation', means: 'Five messages arrive on a frontal screen; the newest reply answers in green.', rules: [1, 4, 5, 7, 8, 10], range: [0, 0.5, 1], tour: [[190, 70], [260, 103], [210, 167], null], mount });

export const conversation = definition;
