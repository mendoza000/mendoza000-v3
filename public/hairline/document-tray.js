const { Cam, clamp, fit, facing, fillet, hull, open, poly, proj, rad, ringAt, rrect, run, seg, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;
const N = 5, W = 76, H = 47, GAP = 7, X0 = -7, X1 = W + 7, Y0 = -8, Y1 = (N - 1) * GAP + 8, THICK = 3, LIFT = 18, REST = -9;
const LR = (p) => p[0][0] <= p[p.length - 1][0] ? p : p.slice().reverse();
function mount({ stage, svg, read }, intensity) {
  const bag = disposer(), C = Cam(45, .5, 1.8);
  fit(C, [[X0,Y0,0],[X1,Y1,0],[X0,Y1,0],[X1,Y0,H+LIFT]], 200,166);
  const P = proj(C), front = facing(C), outer = rrect(X0,Y0,X1,Y1,8,6), inner = rrect(X0+THICK,Y0+THICK,X1-THICK,Y1-THICK,5,6);
  const g = mk("g",{},svg);
  // Rounded tray shell, far wall first; the near wall masks sheet bottoms.
  mk("path",{d:poly(hull(ringAt(P,outer,0).concat(ringAt(P,outer,5)))),class:"sil"},g);
  mk("path",{d:poly(ringAt(P,inner,5)),class:"nf"},g);
  mk("path",{d:open(ringAt(P,run(inner,q=>!front(q)),2)),class:"nf lo"},g);
  const inFront=LR(ringAt(P,run(inner,front),5)), outFront=LR(ringAt(P,run(outer,front),5)), outBase=LR(ringAt(P,run(outer,front),0));
  const items=[];
  for(let i=0;i<N;i++){
    const y=i*GAP, notch=14+(i%3)*17;
    const shape=fillet([[0,0],[W,0],[W,H],[notch+15,H],[notch+15,H+5],[notch,H+5],[notch,H],[0,H]],[1,1,3,2,2,2,2,3]);
    const grp=mk("g",{},g), face=mk("path",{class:i===2?"sil hi":"sil"},grp), back=mk("path",{class:"lo"},grp), crease=mk("path",{class:"nf lo"},grp);
    items.push({shape,face,back,crease, lift:tween(0), tilt:tween(REST), i});
  }
  mk("path",{d:poly([...inFront,outFront.at(-1),...outBase.slice().reverse(),outFront[0]]),class:"fo"},g);
  mk("path",{d:open(outFront),class:"nf lo"},g);
  mk("path",{d:open([outFront[0],...outBase,outFront.at(-1)]),class:"nf sil"},g);
  let active=-1, stagger=intensity;
  function draw(it,lift,angle){
    const {shape,i}=it, s=Math.sin(rad(angle)), c=Math.cos(rad(angle));
    const p=(u,v,z=0)=>P(u,i*GAP+v*s,v*c+z+lift), q=shape.map(([u,v])=>p(u,v)), b=shape.map(([u,v])=>p(u,v,-1.6));
    it.face.setAttribute("d",poly(q)); it.back.setAttribute("d",poly(hull(q.concat(b))));
    it.crease.setAttribute("d",seg(p(7,H-7),p(W-7,H-7)));
  }
  const B=register(stage,(_dt,now)=>{let moving=false; for(const it of items){const l=tval(it.lift,now),a=tval(it.tilt,now);draw(it,l,a);if(!tdone(it.lift,now)||!tdone(it.tilt,now))moving=true;}return moving;}); bag.add(B.unregister);
  // Hit selection uses each sheet's fixed resting screen center, never its moving pose.
  const centers=items.map((_,i)=>P(W/2,i*GAP+H*Math.sin(rad(REST)),H*Math.cos(rad(REST))));
  function hit([x,y]){let best=-1,dist=Infinity;centers.forEach((p,i)=>{const d=Math.hypot(x-p[0],y-p[1]);if(d<dist){dist=d;best=i;}});return dist<65?best:-1;}
  function select(a){if(a===active)return;const now=performance.now(),from=a<0?active:a;active=a;items.forEach((it,i)=>{const delay=Math.abs(i-from)*stagger; tset(it.lift,a===i?LIFT:0,now,delay);tset(it.tilt,a<0?REST:i<a?-19:i>a?13:0,now,delay);it.face.classList.toggle("hi",a<0?i===2:i===a);});read.textContent=a<0?"rest":`document ${String(a+1).padStart(2,"0")}`;B.wake();}
  bag.add(pointer(stage,{move:p=>select(hit(p)),leave:()=>select(-1)}));
  return {set:v=>{stagger=v;},destroy:bag.dispose};
}
hairline({name:"document-tray",means:"A rounded document tray: select a sheet and its neighbours part around it.",rules:[1,2,4,5,8,9,10],range:[0,35,70],tour:[[210,163],[185,146],[229,135],null],mount});
