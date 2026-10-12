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
  const path = (d, cls = 'sil') => mk('path', { d, class: cls }, group);
  const line = (a, b, cls = 'nf lo') => path(seg(P(...a), P(...b)), cls);
  const plate = (points, cls = 'sil') => path(poly(points.map((point) => P(...point))), cls);
  const solidBox = (bounds, radius, z0, z1) => {
    const [outer, inner] = rings(...bounds, radius, 1.5), shape = solid(group);
    put(shape, prism(P, front, outer, inner, z0, z1));
    return shape;
  };
  const screenPoly = (points, cls) => path(poly(fillet(points.map((p) => P(...p)), points.map(() => 2.2), 5)), cls);
  const ribbon = (points, widths) => {
    const q = points.map((p) => P(...p)), left = [], right = [];
    q.forEach((p, i) => {
      const a = q[Math.max(0, i - 1)], b = q[Math.min(q.length - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, w = widths[i];
      left.push([p[0] - dy / n * w, p[1] + dx / n * w]);
      right.push([p[0] + dy / n * w, p[1] - dx / n * w]);
    });
    const edge = [...left, ...right.reverse()];
    return poly(fillet(edge, edge.map(() => 3), 5));
  };
  const top = [[-66, -46, 43], [70, -46, 43], [70, 25, 43], [-66, 25, 43]];

  // Chair silhouette and supports sit behind the sitter.
  screenPoly([[-50, 48, 20], [-48, 51, 59], [-42, 53, 66], [-14, 53, 66], [-9, 51, 59], [-10, 48, 20]], 'nf lo');
  line([-29, 51, 19], [-29, 51, 5], 'nf sil');
  line([-29, 51, 5], [-45, 43, 0]); line([-29, 51, 5], [-11, 43, 0]);
  screenPoly([[-52, 28, 23], [-47, 22, 30], [-12, 22, 30], [-7, 28, 23], [-11, 46, 21], [-48, 46, 21]], 'lo');

  // One continuous seated form: hip, waist, shoulders and neck meet in the silhouette.
  const torso = screenPoly([[-53, 25, 35], [-51, 18, 49], [-49, 17, 62], [-43, 17, 70], [-37, 17, 73], [-32, 18, 71], [-27, 18, 68], [-20, 18, 72], [-14, 19, 70], [-10, 21, 64], [-9, 23, 55], [-12, 25, 46], [-9, 28, 37], [-14, 34, 34], [-43, 35, 34]], 'sil');
  // Neck grows from the shoulder contour into a compact, right-facing profile.
  const neck = screenPoly([[-35, 18, 68], [-34, 17, 78], [-29, 16, 81], [-20, 16, 80], [-17, 17, 76], [-13, 17, 74], [-10, 16, 71], [-13, 15, 68], [-18, 15, 66], [-21, 16, 62], [-30, 17, 62]], 'sil');

  // Desk is in front of the lower body; keyboard and laptop sit above it.
  plate(top, 'sil'); path(open([...top.map((p) => P(...p)), P(...top[0])]), 'nf lo');
  for (const x of [-57, 60]) { line([x, 18, 0], [x, 18, 42], 'nf sil'); line([x, 18, 0], [x, -8, 0]); }
  const laptop = (p) => P(p[0] - 10, p[1] + 12, p[2]);
  const base = [[4, -21, 44], [57, -21, 44], [64, 10, 40], [-2, 10, 40]];
  path(poly(base.map(laptop)), 'sil'); path(open([...base.map(laptop), laptop(base[0])]), 'nf lo');
  path(seg(laptop([6, -17, 44.5]), laptop([53, -17, 44.5])), 'nf lo');
  const screenPoint = (angle, u, v) => { const tilt = rad(angle); return [4 + u - 10, -21 - Math.sin(tilt) * v + 12, 44 + Math.cos(tilt) * v]; };
  const lid = path('', 'sil'), lidEdge = path('', 'nf lo'), screenInset = path('', 'nf lo');
  const drawLid = (angle) => {
    const corners = [[0, 0], [48, 0], [48, 38], [0, 38]].map(([u, v]) => screenPoint(angle, u, v));
    lid.setAttribute('d', poly(fillet(corners.map(p => P(...p)), [3, 3, 3, 3], 4)));
    lidEdge.setAttribute('d', open([...corners.map(p => P(...p)), P(...corners[0])]));
    screenInset.setAttribute('d', poly(fillet([[5,5],[43,5],[43,33],[5,33]].map(([u,v]) => P(...screenPoint(angle,u,v))), [1,1,1,1], 3)));
  };
  const keys = [];
  for (let row = 0; row < 3; row++) for (let col = 0; col < 7; col++) {
    const x = 9 + col * 6, y = -15 + row * 6;
    keys.push(path(poly([[x,y,44.5],[x+4.5,y,44.5],[x+4.5,y+4.5,44.5],[x,y+4.5,44.5]].map(laptop)), 'nf lo'));
  }
  path(poly([[28,-7,44.6],[39,-7,44.6],[39,0,44.6],[28,0,44.6]].map(laptop)), 'nf lo');
  // Let the upper body overlap the desk plane, while keeping the chair behind it.
  group.append(torso, neck);

  // Message is a small rounded bubble beside the screen, with a single nearby tail.
  const message = path('', 'sil'), messageTail = path('', 'nf lo');
  const arms = [path('', 'sil'), path('', 'sil')], cuffs = [path('', 'nf lo'), path('', 'nf lo')];
  const near = [[-39,23,62],[-41.5,13.5,39],[-15,-3,45],[-4,-2,44.5]];
  const far = [[-10,22,61],[-11.5,14.5,37],[21,-4,45],[29,-2,44.5]];
  const progress = spring(value); let lastDrawn = -1;
  function draw(p) {
    const opening = ease((p - 0.22) / 0.42), arrival = ease(p / 0.28);
    drawLid(78 - 66 * opening);
    const shift = arrival * 1.5;
    const posedNear = near.map((v,i) => i < 2 ? v : [v[0] + shift, v[1], v[2]]);
    const posedFar = far.map((v,i) => i < 2 ? v : [v[0] + shift, v[1], v[2]]);
    arms[0].setAttribute('d', ribbon(posedFar, [7.2,6.2,4.4,3.3]));
    arms[1].setAttribute('d', ribbon(posedNear, [8,7,4.7,3.5]));
    cuffs[0].setAttribute('d', poly([P(...posedFar[0]),P(...posedFar[1]),P(...posedFar[1]),P(...posedFar[0])]));
    const x = 42 + 2 * arrival, y = -31, z = 53;
    const bubble = [[x,y,z],[x+23,y,z],[x+23,y,z+15],[x,y,z+15]].map(v=>P(...v));
    message.setAttribute('d', poly(fillet(bubble,[3,3,3,3],5)));
    messageTail.setAttribute('d', open([P(x+16,y,z),P(x+13,y,z-5),P(x+13,y,z+1)]));
    message.classList.toggle('hi', p < 0.55); lid.classList.toggle('hi', p >= 0.55 && p < 0.82);
    read.textContent = p < 0.22 ? 'rest' : p < 0.5 ? 'message' : p < 0.78 ? 'open' : 'work';
  }
  draw(progress.x);
  const board = register(stage, (dt) => { const moving = stepS(progress, dt); if (moving || progress.x !== lastDrawn) { lastDrawn = progress.x; draw(progress.x); } return moving; });
  const anchors = [P(8,17,52), P(29,-37,60), P(32,-27,45)];
  const hit = ([x,y]) => { const nearest = anchors.map((point,i)=>[Math.hypot(x-point[0],y-point[1]),i]).sort((a,b)=>a[0]-b[0])[0]; return nearest[0] < 78 ? [0.27,0.72,1][nearest[1]] : REST; };
  const setTarget = (target) => { progress.t = target; board.wake(); };
  bag.add(pointer(stage,{move:point=>setTarget(hit(point)),leave:()=>setTarget(REST)}));
  bag.add(board.unregister); bag.add(()=>svg.replaceChildren());
  return {set:next=>{progress.t=clamp(next,0,1);board.wake();},destroy:bag.dispose};
}
hairline({name:'conversation',means:'A message arrives as its reader opens a laptop and begins to work.',rules:[1,4,5,6,7,8,9,10],range:[0,0.5,1],tour:[[187,138],[296,92],[277,163],null],mount});
