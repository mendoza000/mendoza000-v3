const {
  Cam, facing, fillet, fit, open, poly, proj, rings, seg, disposer, mk, put,
  register, pointer, solid, prism,
} = HL;

const BODY = { halfW: 82, rearY: -52, frontY: 46, topZ: 5.2 };
const SCREEN = { halfW: 69, height: 86, radius: 6, hingeY: BODY.rearY + 4 };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const camera = Cam(0, 0.5, 1.72);
  fit(camera, [
    [-BODY.halfW, BODY.rearY, 0], [BODY.halfW, BODY.frontY, 0],
    [-BODY.halfW, BODY.frontY, 0], [BODY.halfW, BODY.rearY, 0],
    [-SCREEN.halfW, SCREEN.hingeY, BODY.topZ], [SCREEN.halfW, SCREEN.hingeY, BODY.topZ],
    [-SCREEN.halfW, SCREEN.hingeY, BODY.topZ + SCREEN.height],
    [SCREEN.halfW, SCREEN.hingeY, BODY.topZ + SCREEN.height],
  ], 200, 166);
  const P = proj(camera), front = facing(camera);
  const root = mk('g', {}, svg);
  const screen = mk('g', { 'data-part': 'screen' }, root);
  const base = mk('g', { 'data-part': 'base' }, root);
  const keyboard = mk('g', { 'data-part': 'keyboard' }, root);
  const trackpad = mk('g', { 'data-part': 'trackpad' }, root);
  const hinge = mk('g', { 'data-part': 'hinge' }, root);
  const addPath = (parent, d, cls = 'sil', part) => mk('path', {
    d, class: cls, ...(part ? { 'data-part': part } : {}),
  }, parent);
  const roundedOutline = (parent, points, r, cls, part) =>
    addPath(parent, poly(fillet(points, Array(points.length).fill(r), 5)), cls, part);
  const screenPoint = (x, v) => P(x, SCREEN.hingeY, BODY.topZ + v);
  const screenRect = (parent, x0, v0, x1, v1, r, cls, part) => roundedOutline(
    parent, [screenPoint(x0, v0), screenPoint(x1, v0), screenPoint(x1, v1), screenPoint(x0, v1)], r, cls, part,
  );
  const topRect = (parent, x0, y0, x1, y1, r, cls, part) => roundedOutline(
    parent, [P(x0, y0, BODY.topZ + 0.15), P(x1, y0, BODY.topZ + 0.15),
      P(x1, y1, BODY.topZ + 0.15), P(x0, y1, BODY.topZ + 0.15)], r, cls, part,
  );
  const screenLine = (x0, v0, x1, v1) => seg(screenPoint(x0, v0), screenPoint(x1, v1));

  // Upright display centered on the same x-axis as the chassis; both meet at the hinge.
  screenRect(screen, -SCREEN.halfW, 0, SCREEN.halfW, SCREEN.height,
    SCREEN.radius, 'sil', 'screen-frame');
  screenRect(screen, -SCREEN.halfW + 6, 6, SCREEN.halfW - 6, SCREEN.height - 6,
    4, 'nf lo', 'screen-inset');
  const straightHalf = SCREEN.halfW - SCREEN.radius;
  addPath(screen, screenLine(-straightHalf, 0, straightHalf, 0), 'nf lo', 'screen-lower-edge');
  addPath(screen, screenLine(-straightHalf, SCREEN.height, straightHalf, SCREEN.height), 'nf lo', 'screen-top-edge');
  addPath(screen, screenLine(-SCREEN.halfW, 6, -SCREEN.halfW, SCREEN.height - 6), 'nf lo', 'screen-left-edge');
  addPath(screen, screenLine(SCREEN.halfW, 6, SCREEN.halfW, SCREEN.height - 6), 'nf lo', 'screen-right-edge');

  // Asymmetric conversation bubbles stay on the display plane.
  const bubble = (x0, v0, x1, v1, cls, part) => screenRect(
    screen, x0, v0, x1, v1, 4, cls, part,
  );
  bubble(-55, 53, -5, 72, 'sil', 'incoming-bubble');
  addPath(screen, screenLine(-46, 65, -20, 65), 'nf lo');
  addPath(screen, screenLine(-46, 59, -30, 59), 'nf lo');
  bubble(5, 28, 55, 47, 'hi', 'outgoing-bubble');
  addPath(screen, screenLine(14, 40, 40, 40), 'nf hi');
  addPath(screen, screenLine(14, 34, 30, 34), 'nf hi');

  const [bodyRing, bodyCrease] = rings(
    -BODY.halfW, BODY.rearY, BODY.halfW, BODY.frontY, 8, 1.6,
  );
  const body = solid(base);
  put(body, prism(P, front, bodyRing, bodyCrease, 0, BODY.topZ));
  addPath(base, seg(P(-BODY.halfW + 7, BODY.frontY - 7, BODY.topZ + 0.1),
    P(BODY.halfW - 7, BODY.frontY - 7, BODY.topZ + 0.1)), 'nf lo', 'base-front-crease');

  const hingeHalf = straightHalf;
  addPath(hinge, seg(
    P(-hingeHalf, SCREEN.hingeY, BODY.topZ),
    P(hingeHalf, SCREEN.hingeY, BODY.topZ),
  ), 'nf sil', 'hinge-line');

  // Three centered rows; each row's start derives from its own key count and pitch.
  const keyW = 8, keyH = 4.6, keyGap = 3, rowYs = [-35, -27, -19], rowCounts = [11, 10, 9];
  for (let row = 0; row < rowCounts.length; row++) {
    const count = rowCounts[row], pitch = keyW + keyGap;
    const rowWidth = count * keyW + (count - 1) * keyGap;
    const start = -rowWidth / 2;
    for (let col = 0; col < count; col++) {
      const x = start + col * pitch, y = rowYs[row];
      topRect(keyboard, x, y, x + keyW, y + keyH, 0.8, 'nf lo');
    }
  }
  topRect(trackpad, -19, 0, 19, 18, 2, 'nf lo', 'trackpad-outline');

  const loop = register(stage, () => false);
  bag.add(loop.unregister);
  const receivedAt = screenPoint(-30, 62), sentAt = screenPoint(30, 37);
  bag.add(pointer(stage, {
    move: ([x, y]) => {
      const received = Math.hypot(x - receivedAt[0], y - receivedAt[1]);
      const sent = Math.hypot(x - sentAt[0], y - sentAt[1]);
      read.textContent = Math.min(received, sent) > 52 ? 'rest' : received < sent ? 'received' : 'sent';
    },
    leave: () => { read.textContent = 'rest'; },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = 'rest';
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: 'conversation',
  means: 'A frontal open laptop holds a quiet exchange of incoming and outgoing messages.',
  rules: [4, 5, 6, 9, 10],
  range: [0, 0.5, 1],
  tour: [[200, 100], [200, 150], [200, 190], null],
  mount,
});
