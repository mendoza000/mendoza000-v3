const {
  Cam, fillet, fit, open, poly, proj, rings, seg, disposer, mk, put, register,
  pointer, solid, prism,
} = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const camera = Cam(45, 0.5, 1.72);
  fit(camera, [
    [-82, -52, 0], [82, 46, 0], [-82, 46, 0], [82, -52, 0],
    [-70, -43, 91], [70, -43, 91],
  ], 200, 166);
  const P = proj(camera), group = mk('g', {}, svg);
  const path = (d, cls = 'sil') => mk('path', { d, class: cls }, group);
  const outline = (points, radii, cls = 'sil') => path(poly(fillet(points, radii, 5)), cls);
  const screenPoint = (x, v) => P(x, -41 - v * 0.17, 6 + v * 0.985);
  const screenShape = (x0, v0, x1, v1, radius, cls) => outline([
    screenPoint(x0 + radius, v0), screenPoint(x1 - radius, v0),
    screenPoint(x1, v0 + radius), screenPoint(x1, v1 - radius),
    screenPoint(x1 - radius, v1), screenPoint(x0 + radius, v1),
    screenPoint(x0, v1 - radius), screenPoint(x0, v0 + radius),
  ], Array(8).fill(2.1), cls);

  // The open display is one rounded plate with a recessed-looking inner rim.
  screenShape(-70, 0, 70, 88, 7, 'sil');
  screenShape(-63, 6, 63, 82, 5, 'nf lo');
  path(seg(screenPoint(-58, 76), screenPoint(58, 76)), 'nf lo');

  // Two asymmetric conversation bubbles lie in the display plane; the outgoing one is the accent.
  const bubble = (x0, v0, x1, v1, cls) => {
    const r = 5;
    outline([
      screenPoint(x0 + r, v0), screenPoint(x1 - r, v0),
      screenPoint(x1, v0 + r), screenPoint(x1, v1 - r),
      screenPoint(x1 - r, v1), screenPoint(x0 + r, v1),
      screenPoint(x0, v1 - r), screenPoint(x0, v0 + r),
    ], Array(8).fill(2), cls);
  };
  bubble(-54, 48, -3, 68, 'sil');
  path(seg(screenPoint(-45, 61), screenPoint(-20, 61)), 'nf lo');
  path(seg(screenPoint(-45, 55), screenPoint(-30, 55)), 'nf lo');
  bubble(3, 25, 54, 45, 'hi');
  path(seg(screenPoint(13, 38), screenPoint(39, 38)), 'nf hi');
  path(seg(screenPoint(13, 32), screenPoint(30, 32)), 'nf hi');

  // Rounded, thin chassis and restrained keys/trackpad identify the base.
  const [baseRing, baseCrease] = rings(-82, -52, 82, 46, 8, 1.5);
  const chassis = solid(group);
  put(chassis, prism(P, () => true, baseRing, baseCrease, 0, 5.2));
  path(seg(P(-75, 39, 5.25), P(75, 39, 5.25)), 'nf lo');
  const keyRows = [-34, -26, -18];
  for (let row = 0; row < keyRows.length; row++) {
    const y = keyRows[row], count = row === 2 ? 10 : 11;
    for (let col = 0; col < count; col++) {
      const x = -62 + col * 11.5 + (row === 1 ? 2 : 0);
      path(open([P(x, y, 5.35), P(x + 7.6, y, 5.35), P(x + 7.6, y + 4.2, 5.35), P(x, y + 4.2, 5.35), P(x, y, 5.35)]), 'nf lo');
    }
  }
  path(open([P(-18, -5, 5.35), P(18, -5, 5.35), P(18, 5, 5.35), P(-18, 5, 5.35)]), 'nf lo');

  const loop = register(stage, () => false);
  bag.add(loop.unregister);
  bag.add(pointer(stage, {
    move: ([x, y]) => { read.textContent = Math.hypot(x - 218, y - 144) < 58 ? 'sent' : Math.hypot(x - 174, y - 111) < 58 ? 'received' : 'rest'; },
    leave: () => { read.textContent = 'rest'; },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = 'rest';
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: 'conversation',
  means: 'An open laptop holds a quiet exchange of incoming and outgoing messages.',
  rules: [4, 5, 6, 9, 10],
  range: [0, 0.5, 1],
  tour: [[174, 111], [218, 144], [200, 166], null],
  mount,
});
