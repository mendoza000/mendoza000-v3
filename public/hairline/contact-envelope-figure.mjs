import HL from './contact-envelope-kernel.mjs';
let definition;
const hairline = value => { definition = value; };
const { Cam, clamp, fillet, fit, hull, open, poly, proj, rad, ringAt, rrect, spring, stepS, disposer, mk, pointer, register } = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.12);
  const x0 = -58, x1 = 58, y0 = -35, y1 = 35, depth = 2.2;
  fit(C, [[x0, y0, 0], [x1, y1, 0], [0, y0, 60]], 200, 166);
  const P = proj(C), body = rrect(x0, y0, x1, y1, 7, 8);
  const group = mk('g', {}, svg), plate = mk('path', { class: 'sil' }, group);
  const crease = mk('path', { class: 'nf lo' }, group);
  const flap = mk('path', { class: 'sil hi' }, group);
  const folds = mk('path', { class: 'nf lo' }, group);
  const angle = spring(2);
  let openState = false, stiffness = value, last = '';
  const rest = poly(hull(ringAt(P, body, depth).concat(ringAt(P, body, 0))));
  plate.setAttribute('d', rest);
  crease.setAttribute('d', open(ringAt(P, rrect(x0 + 4, y0 + 4, x1 - 4, y1 - 4, 4, 8), depth)));
  function draw() {
    const a = rad(angle.x), hinge = y0 + 3, left = [x0 + 3, hinge], right = [x1 - 3, hinge];
    const tip = [0, hinge + (y1 - y0 - 6) * Math.cos(a), depth + 0.2 + (y1 - y0 - 6) * Math.sin(a)];
    const outline = [P(...left, depth + 0.2), P(...right, depth + 0.2), P(...tip)];
    flap.setAttribute('d', poly(fillet(outline, [1.2, 1.2, 1.2])));
    folds.setAttribute('d', open([P(x0 + 3, y0 + 3, depth + 0.3), P(0, y1 - 4, depth + 0.3), P(x1 - 3, y0 + 3, depth + 0.3)]));
  }
  const board = register(stage, (dt) => { const moving = stepS(angle, dt); if (last !== angle.x) { draw(); last = angle.x; } return moving; });
  bag.add(board.unregister);
  const center = P(0, 0, 0), radius = 92;
  const update = (p) => {
    const dx = p[0] - center[0], dy = p[1] - center[1];
    const selected = dx * dx + dy * dy < radius * radius;
    const proximity = clamp(1 - Math.hypot(dx, dy) / radius, 0, 1);
    const target = selected ? 2 + (clamp(55 + stiffness * 0.1, 55, 64) - 2) * proximity : 2;
    if (selected === openState && Math.abs(target - angle.t) < 0.01) return;
    openState = selected;
    angle.t = target;
    read.textContent = selected ? 'open' : 'rest';
    board.wake();
  };
  bag.add(pointer(stage, { move: update, leave: () => update([-1000, -1000]) }));
  bag.add(() => svg.replaceChildren());
  return { set(v) { stiffness = v; }, destroy: bag.dispose };
}

hairline({
  name: "envelope",
  means: "A folded envelope lifts its flap when you draw near.",
  rules: [1, 4, 5, 7, 8, 9],
  range: [0, 35, 70],
  tour: [[250, 200], [220, 200], [200, 200], null],
  mount,
});

export const envelope = definition;
