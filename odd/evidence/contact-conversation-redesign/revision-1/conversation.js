const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, put, register, pointer, solid,
} = HL;
const REST = 0;
const ease = (value) => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const camera = Cam(45, 0.5, 1.78);
  fit(camera, [[-80, -65, 0], [92, 78, 0], [-80, 78, 106], [92, -65, 106]], 200, 166);
  const P = proj(camera), front = facing(camera), group = mk('g', {}, svg);
  const laptop = (point) => P(point[0] - 10, point[1] + 12, point[2]);
  const path = (d, cls = 'sil') => mk('path', { d, class: cls }, group);
  const line = (a, b, cls = 'nf lo') => path(seg(P(...a), P(...b)), cls);
  const plate = (points, cls = 'sil') => path(poly(points.map((point) => P(...point))), cls);
  const solidBox = (bounds, radius, z0, z1) => {
    const [outer, inner] = rings(...bounds, radius, 1.5), shape = solid(group);
    put(shape, prism(P, front, outer, inner, z0, z1));
    return shape;
  };
  const oval = (x, y, z, rx, rz, cls = 'sil') => {
    const points = Array.from({ length: 24 }, (_, i) => { const a = i * Math.PI / 12; return P(x + Math.cos(a) * rx, y, z + Math.sin(a) * rz); });
    return path(poly(points), cls);
  };
  const volume = (cx, cy, cz, rx, ry, rz, cls = 'sil') => {
    const points = [];
    for (let layer = -4; layer <= 4; layer++) {
      const d = layer / 4, scale = Math.sqrt(1 - d * d);
      for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; points.push(P(cx + Math.cos(a) * rx * scale, cy + d * ry, cz + Math.sin(a) * rz * scale)); }
    }
    return path(poly(hull(points)), cls);
  };
  const tube = (points, width) => {
    const projected = points.map((point) => P(...point)), edge = [];
    projected.forEach((point, i) => {
      const before = projected[Math.max(0, i - 1)], after = projected[Math.min(projected.length - 1, i + 1)];
      const dx = after[0] - before[0], dy = after[1] - before[1], length = Math.hypot(dx, dy) || 1;
      edge.push([point[0] - dy / length * width, point[1] + dx / length * width]);
    });
    for (let i = projected.length - 1; i >= 0; i--) {
      const before = projected[Math.max(0, i - 1)], after = projected[Math.min(projected.length - 1, i + 1)];
      const dx = after[0] - before[0], dy = after[1] - before[1], length = Math.hypot(dx, dy) || 1;
      edge.push([projected[i][0] + dy / length * width, projected[i][1] - dx / length * width]);
    }
    return poly(fillet(edge, edge.map(() => 2), 4));
  };

  // Compact writing desk: its rear edge sits close to the seated figure.
  const top = [[-66, -46, 43], [70, -46, 43], [70, 25, 43], [-66, 25, 43]];
  plate(top); path(open([...top.map((p) => P(...p)), P(...top[0])]), 'nf lo');
  for (const x of [-57, 60]) { line([x, 18, 0], [x, 18, 42], 'nf sil'); line([x, 18, 0], [x, -8, 0]); }

  // Chair is behind the body: distinct back, stem, and seat under the hips.
  oval(-25, 49, 48, 25, 34, 'nf lo');
  line([-25, 48, 17], [-25, 48, 7], 'nf sil');
  line([-25, 48, 8], [-41, 48, 0]); line([-25, 48, 8], [-9, 48, 0]);
  oval(-25, 31, 38, 27, 6, 'nf lo');

  // Soft connected torso and neck; the head turns toward the laptop at front-right.
  volume(-24, 27, 55, 22, 12, 23);
  volume(-19, 23, 69, 12, 9, 5, 'lo');
  volume(-11, 18, 87, 12, 10, 15);
  // Shoulders, bent elbows, forearms, and hands all terminate at the nearby keyboard.
  const arms = [path('', 'sil'), path('', 'sil')], sleeves = [path('', 'lo'), path('', 'lo')];
  // A compact laptop on the tabletop, its hinged screen tilted back toward the sitter.
  const base = [[4, -21, 44], [57, -21, 44], [64, 10, 40], [-2, 10, 40]];
  path(poly(base.map(laptop)));
  path(open([...base.map(laptop), laptop(base[0])]), 'nf lo');
  path(seg(laptop([6, -17, 44.5]), laptop([53, -17, 44.5])), 'nf lo');
  const lid = path('', 'sil'), lidEdge = path('', 'nf lo'), screenInset = path('', 'nf lo');
  const keys = Array.from({ length: 24 }, () => path('', 'nf lo')), trackpad = path('', 'nf lo');
  const screenPoint = (angle, u, v) => { const tilt = rad(angle); return [4 + u - 10, -21 - Math.sin(tilt) * v + 12, 44 + Math.cos(tilt) * v]; };
  const drawLid = (angle) => {
    const corners = [[0, 0], [48, 0], [48, 38], [0, 38]].map(([u, v]) => screenPoint(angle, u, v));
    lid.setAttribute('d', poly(corners.map((p) => P(...p))));
    lidEdge.setAttribute('d', open([...corners.map((p) => P(...p)), P(...corners[0])]));
    screenInset.setAttribute('d', poly([[5, 5], [43, 5], [43, 33], [5, 33]].map(([u, v]) => P(...screenPoint(angle, u, v)))));
  };
  for (let row = 0; row < 3; row++) for (let col = 0; col < 8; col++) {
    const el = keys[row * 8 + col], x = 8 + col * 5.5, y = -16 + row * 6;
    el.setAttribute('d', poly([[x, y, 44.5], [x + 4, y, 44.5], [x + 4, y + 4, 44.5], [x, y + 4, 44.5]].map(laptop)));
  }
  trackpad.setAttribute('d', poly([[27, -7, 44.6], [39, -7, 44.6], [39, 0, 44.6], [27, 0, 44.6]].map(laptop)));
  const message = path('', 'sil'), messageTail = path('', 'nf lo');
  const progress = spring(value); let lastDrawn = -1;
  function draw(p) {
    const opening = ease((p - 0.22) / 0.42), arrival = ease(p / 0.28), typing = ease((p - 0.55) / 0.45);
    drawLid(78 - 66 * opening);
    const reach = typing * 3;
    // Shoulder-to-elbow-to-wrist lengths are balanced and elbows stay below shoulders.
    arms[0].setAttribute('d', tube([[-39, 24, 63], [-46, 9, 54], [-28, -4, 47], [-8, -4, 45], [reach, 8, 45]], 2.8));
    arms[1].setAttribute('d', tube([[-8, 22, 62], [2, 8, 53], [19, -4, 47], [20, 8, 45], [32 + reach, 8, 45]], 2.8));
    sleeves[0].setAttribute('d', tube([[-39, 24, 63], [-46, 9, 54], [-28, -4, 47]], 4.5));
    sleeves[1].setAttribute('d', tube([[-8, 22, 62], [2, 8, 53], [19, -4, 47]], 4.5));
    const x = -2 + 15 * arrival, y = -14 + 7 * arrival, z = 44;
    const bubble = [[x, y, z], [x + 24, y, z], [x + 24, y, z + 15], [x + 17, y, z + 15], [x + 13, y, z + 10], [x + 12, y, z + 15], [x, y, z + 15]].map((point) => P(...point));
    message.setAttribute('d', poly(fillet(bubble, [2, 2, 2, 1.5, 1.2, 1.2, 2], 4)));
    messageTail.setAttribute('d', open([P(x + 17, y, z + 15), P(x + 13, y, z + 10), P(x + 13, y, z + 15)]));
    message.classList.toggle('hi', p < 0.55); lid.classList.toggle('hi', p >= 0.55 && p < 0.82);
    read.textContent = p < 0.22 ? 'rest' : p < 0.5 ? 'message' : p < 0.78 ? 'open' : 'work';
  }
  draw(progress.x);
  const board = register(stage, (dt) => { const moving = stepS(progress, dt); if (moving || progress.x !== lastDrawn) { lastDrawn = progress.x; draw(progress.x); } return moving; });
  const anchors = [P(8, 17, 52), P(29, -37, 60), P(32, -27, 45)];
  const hit = ([x, y]) => { const nearest = anchors.map((point, i) => [Math.hypot(x - point[0], y - point[1]), i]).sort((a, b) => a[0] - b[0])[0]; return nearest[0] < 78 ? [0.27, 0.72, 1][nearest[1]] : REST; };
  const setTarget = (target) => { progress.t = target; board.wake(); };
  bag.add(pointer(stage, { move: (point) => setTarget(hit(point)), leave: () => setTarget(REST) }));
  bag.add(board.unregister); bag.add(() => svg.replaceChildren());
  return { set: (next) => { progress.t = clamp(next, 0, 1); board.wake(); }, destroy: bag.dispose };
}
hairline({ name: 'conversation', means: 'A message arrives as its reader opens a laptop and begins to work.', rules: [1, 4, 5, 6, 7, 8, 9, 10], range: [0, 0.5, 1], tour: [[187, 138], [296, 92], [277, 163], null], mount });
