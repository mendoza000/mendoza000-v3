const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, put, register, pointer, solid,
} = HL;
const REST = 0;
const ease = (value) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const camera = Cam(45, 0.5, 1.78);
  fit(camera, [
    [-88, -64, 0], [112, 92, 0], [-88, 92, 0], [112, -64, 0],
    [-88, -64, 103], [112, 92, 103],
  ], 200, 166);
  const P = proj(camera), front = facing(camera), group = mk('g', {}, svg);
  const path = (d, cls = 'sil') => mk('path', { d, class: cls }, group), line = (from, to, cls = 'nf lo') => path(seg(P(...from), P(...to)), cls);
  const plate = (points, cls = 'sil') => path(poly(points.map((point) => P(...point))), cls);
  const roundedPlate = (points) => path(poly(fillet(points.map((point) => P(...point)), points.map(() => 3.5), 5)), 'sil');
  const ellipsoid = (cx, cy, cz, rx, ry, rz) => {
    const points = [];
    for (let layer = -4; layer <= 4; layer++) {
      const depth = layer / 4, scale = Math.sqrt(1 - depth * depth);
      for (let i = 0; i < 24; i++) { const angle = i * Math.PI / 12; points.push(P(cx + Math.cos(angle) * rx * scale, cy + depth * ry, cz + Math.sin(angle) * rz * scale)); }
    }
    return path(poly(hull(points)), 'sil');
  };
  const extrude = (bounds, radius, z0, z1) => {
    const [outer, inner] = rings(...bounds, radius, 1.5), shape = solid(group);
    put(shape, prism(P, front, outer, inner, z0, z1));
    return shape;
  };
  const tube = (points, width) => {
    const projected = points.map((point) => P(...point));
    const edge = [];
    for (let i = 0; i < projected.length; i++) {
      const before = projected[Math.max(0, i - 1)];
      const after = projected[Math.min(projected.length - 1, i + 1)];
      const dx = after[0] - before[0];
      const dy = after[1] - before[1];
      const length = Math.hypot(dx, dy) || 1;
      edge.push([
        projected[i][0] - dy / length * width,
        projected[i][1] + dx / length * width,
      ]);
    }
    for (let i = projected.length - 1; i >= 0; i--) {
      const before = projected[Math.max(0, i - 1)];
      const after = projected[Math.min(projected.length - 1, i + 1)];
      const dx = after[0] - before[0];
      const dy = after[1] - before[1];
      const length = Math.hypot(dx, dy) || 1;
      edge.push([
        projected[i][0] + dy / length * width,
        projected[i][1] - dx / length * width,
      ]);
    }
    return poly(fillet(edge, edge.map(() => 2.4), 4));
  };
  const oval = (x, y, z, rx, rz, cls = 'sil') => {
    const points = [];
    for (let i = 0; i < 20; i++) {
      const angle = i * Math.PI / 10;
      points.push(P(x + Math.cos(angle) * rx, y, z + Math.sin(angle) * rz));
    }
    return path(poly(points), cls);
  };
  const desk = [[-78, -42, 43], [78, -42, 43], [78, 34, 43], [-78, 34, 43]]; plate(desk);
  path(open([...desk.map((point) => P(...point)), P(...desk[0])]), 'nf lo');
  for (const x of [-65, 65]) {
    line([x, 25, 0], [x, 25, 42], 'nf sil');
    line([x, 25, 0], [x, -8, 0]);
  }
  oval(-20, 48, 52, 24, 31, 'lo');
  oval(-20, 25, 35, 27, 5);
  line([-20, 25, 30], [-20, 25, 4]);
  line([-20, 25, 4], [-37, 25, 0]);
  line([-20, 25, 4], [-3, 25, 0]);
  roundedPlate([
    [-43, 19, 27], [-45, 19, 57], [-38, 19, 69], [-29, 19, 73],
    [-10, 19, 69], [-3, 19, 58], [-7, 19, 28],
  ]);
  line([-37, 18, 63], [-12, 18, 63]);
  line([-39, 18, 32], [-10, 18, 32]);
  extrude([-28, 10, -16, 22], 5, 63, 78);
  ellipsoid(-22, 16, 87, 13, 11, 16);
  const base = [[2, -38, 45], [59, -38, 45], [64, -12, 39], [-3, -12, 39]];
  plate(base);
  path(open([...base.map((point) => P(...point)), P(...base[0])]), 'nf lo');
  line([5, -35, 45], [56, -35, 45]);
  const lid = path('', 'sil'), lidEdge = path('', 'nf lo'), editor = path('', 'nf lo');
  const strokes = Array.from({ length: 5 }, () => path('', 'nf lo'));
  const screenPoint = (angle, u, v) => { const tilt = rad(angle); return [3 + u, -38 - Math.sin(tilt) * v, 43 + Math.cos(tilt) * v]; };
  const setPolygon = (element, points) => element.setAttribute('d', poly(points.map((point) => P(...point))));
  const drawLid = (angle) => {
    const corners = [[0, 0], [53, 0], [53, 37], [0, 37]]
      .map(([u, v]) => screenPoint(angle, u, v));
    setPolygon(lid, corners);
    lidEdge.setAttribute('d', open([...corners.map((point) => P(...point)), P(...corners[0])]));
    setPolygon(editor, [[6, 5], [48, 5], [48, 31], [6, 31]]
      .map(([u, v]) => screenPoint(angle, u, v)));
    [[9, 25, 32], [14, 20, 42], [10, 15, 37], [18, 10, 35], [8, 6, 15]]
      .forEach(([x, y, end], i) => {
        strokes[i].setAttribute('d', seg(
          P(...screenPoint(angle, x, y)), P(...screenPoint(angle, end, y)),
        ));
      });
  };
  const keys = [];
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 8; column++) keys.push(path('', 'nf lo'));
  }
  const trackpad = path('', 'nf lo'), arms = [path('', 'sil'), path('', 'sil')];
  const message = path('', 'sil'), messageTail = path('', 'nf lo');
  const progress = spring(value); let lastDrawn = -1;
  function draw(p) {
    const mix = (from, to, amount) => from + (to - from) * amount;
    const opening = ease((p - 0.22) / 0.42);
    const arrival = ease(p / 0.28);
    const typing = ease((p - 0.55) / 0.45);
    drawLid(mix(78, 12, opening));
    const quad = (points) => poly(points.map((point) => P(...point)));
    keys.forEach((element, index) => {
      const row = Math.floor(index / 8), column = index % 8;
      const x = 7 + column * 6.05, y = -33 + row * 5.7;
      element.setAttribute('d', quad([
        [x, y, 45.2], [x + 4.4, y, 45.2],
        [x + 4.4, y + 3.8, 45.2], [x, y + 3.8, 45.2],
      ]));
    });
    trackpad.setAttribute('d', quad([
      [25, -27, 45.3], [37, -27, 45.3],
      [37, -21, 45.3], [25, -21, 45.3],
    ]));
    const x = mix(-30, 18, arrival), y = mix(4, 22, arrival), z = 43;
    const card = [
      [x, y, z], [x + 27, y, z], [x + 27, y, z + 7],
      [x + 32, y + 2, z + 4], [x + 27, y, z + 1],
      [x + 27, y, z + 17], [x, y, z + 17],
    ].map((point) => P(...point));
    message.setAttribute('d', poly(fillet(card, [2.4, 2.4, 1.8, 1.2, 1.2, 2.4, 2.4], 4)));
    messageTail.setAttribute('d', open([
      P(x + 27, y, z + 7), P(x + 22, y, z + 7), P(x + 27, y, z + 12),
    ]));
    const reach = typing * 8;
    arms[0].setAttribute('d', tube([
      [-39, 15, 63], [-52, 0, 52], [-24, -16, 47], [3, -22, 45], [16 + reach, -27, 45],
    ], 4.2));
    arms[1].setAttribute('d', tube([
      [-9, 15, 62], [6, 0, 52], [26, -16, 47], [31, -22, 45], [41 + reach, -27, 45],
    ], 4.2));
    message.classList.toggle('hi', p < 0.55);
    lid.classList.toggle('hi', p >= 0.55 && p < 0.82);
    strokes[1].classList.toggle('lo', p < 0.82);
    strokes[1].classList.toggle('hi', p >= 0.82);
    read.textContent = p < 0.22 ? 'rest' : p < 0.5 ? 'message' : p < 0.78 ? 'open' : 'work';
  }
  draw(progress.x);
  const board = register(stage, (dt) => {
    const moving = stepS(progress, dt);
    if (moving || progress.x !== lastDrawn) {
      lastDrawn = progress.x;
      draw(progress.x);
    }
    return moving;
  });
  const anchors = [P(8, 22, 52), P(29, -37, 60), P(32, -27, 45)];
  const hit = ([x, y]) => {
    const nearest = anchors.map((point, i) => [Math.hypot(x - point[0], y - point[1]), i])
      .sort((a, b) => a[0] - b[0])[0];
    return nearest[0] < 78 ? [0.27, 0.72, 1][nearest[1]] : REST;
  };
  const setTarget = (target) => {
    progress.t = target;
    board.wake();
  };
  bag.add(pointer(stage, {
    move: (point) => setTarget(hit(point)),
    leave: () => setTarget(REST),
  }));
  bag.add(board.unregister);
  bag.add(() => svg.replaceChildren());
  return {
    set: (next) => {
      progress.t = clamp(next, 0, 1);
      board.wake();
    },
    destroy: bag.dispose,
  };
}
hairline({
  name: 'conversation',
  means: 'A message arrives at a desk; its reader opens a laptop and begins to work.',
  rules: [1, 4, 5, 6, 7, 8, 9, 10],
  range: [0, 0.5, 1],
  tour: [[187, 138], [296, 92], [277, 163], null],
  mount,
});
