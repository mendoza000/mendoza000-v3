const { Cam, clamp, fillet, fit, poly, proj, seg, tween, tset, tval, disposer, mk, register, pointer } = HL;
const W = 92, H = 104;
function mount({ stage, svg, read }, value) {
  const bag = disposer(), camera = Cam(0, 0.5, 1.55);
  fit(camera, [[-W, 0, 0], [W, 0, H]], 200, 160);
  const P = proj(camera), group = mk('g', { 'data-part': 'screen-only' }, svg);
  const point = (x, z) => P(x, 0, z);
  const rounded = (x0, z0, x1, z1, r) => poly(fillet([[x0,z0],[x1,z0],[x1,z1],[x0,z1]].map(([x,z])=>point(x,z)), [r,r,r,r], 6));
  const path = (d, cls, part) => mk('path', { d, class: cls, ...(part ? { 'data-part': part } : {}) }, group);
  if (!read.textContent) read.textContent = 'rest';
  path(rounded(-W,0,W,H,9), 'sil', 'screen-frame');
  path(rounded(-W+5,5,W-5,H-5,6), 'nf lo', 'screen-inner-rim');
  const incoming = path('', 'sil', 'incoming-bubble'), inLine1=path('', 'nf lo'), inLine2=path('', 'nf lo');
  const outgoing = path('', 'hi', 'outgoing-bubble'), outLine=path('', 'nf hi');
  const dots=[0,1,2].map(i=>mk('circle',{cx:point(12+i*12,35)[0],cy:point(12+i*12,35)[1],r:2.3,class:'dot off','data-part':'typing-dot','data-index':i},group));
  const line=(x0,z0,x1,z1)=>seg(point(x0,z0),point(x1,z1));
  const arrive=tween(0), reply=tween(0); let lastIncoming=-1,lastReply=-1,lastDot=-2;
  let phaseStart=null, phase=0, stopped=value===0, activeTarget=-1;
  const setBubble=(el,x,z,w,h,progress)=>{
    const shift=(1-progress)*4; el.setAttribute('d',rounded(x+shift,z,x+w+shift,z+h,4));
  };
  function draw(now, force=false) {
    const a=tval(arrive,now), b=tval(reply,now);
    if(force||a!==lastIncoming){setBubble(incoming,-72,63,70,24,a);inLine1.setAttribute('d',line(-61+4*(1-a),78,-31+4*(1-a),78));inLine2.setAttribute('d',line(-61+4*(1-a),70,-43+4*(1-a),70));lastIncoming=a;}
    if(force||b!==lastReply){setBubble(outgoing,2,29,70,24,b);outLine.setAttribute('d',line(13+4*(1-b),44,50+4*(1-b),44));lastReply=b;}
    const showTyping=!stopped && phase===1;
    const typingDot=showTyping?Math.floor(now/240)%3:-1;
    if(typingDot!==lastDot){dots.forEach((dot,i)=>dot.setAttribute('class',typingDot===i?'dot m':'dot off'));lastDot=typingDot;}
  }
  const schedule=(next,now)=>{
    phase=next; phaseStart=now;
    if(next===0){tset(arrive,0,now,0);tset(reply,0,now,0);}
    if(next===1){tset(arrive,1,now,0);tset(reply,0,now,0);}
    if(next===2){tset(arrive,1,now,0);tset(reply,1,now,0);}
    if(next===3){tset(arrive,1,now,0);tset(reply,1,now,0);}
  };
  // Two complete messages form the initial and reduced-motion rest pose.
  tset(arrive,1,0,0);tset(reply,1,0,0);
  const board=register(stage,(dt,now)=>{
    if(stopped){draw(now);return false;}
    if(phaseStart===null)schedule(0,now);
    const elapsed=now-phaseStart;
    if(phase===0&&elapsed>1800)schedule(1,now);
    else if(phase===1&&elapsed>850)schedule(2,now);
    else if(phase===2&&elapsed>950)schedule(3,now);
    else if(phase===3&&elapsed>3000)schedule(0,now);
    draw(now);
    return !stopped;
  });
  const reset=()=>{stopped=true;phase=3;tset(arrive,1,0,0);tset(reply,1,0,0);board.wake();}
  bag.add(pointer(stage,{move:([x,y])=>{const p=point(42,41);const target=Math.hypot(x-p[0],y-p[1])<60?2:-1;if(target!==activeTarget){activeTarget=target;if(target===2){stopped=true;tset(arrive,1,0,0);tset(reply,1,0,0);}else{stopped=value===0;phaseStart=null;}board.wake();}},leave:()=>{activeTarget=-1;stopped=value===0;phaseStart=null;board.wake();}}));
  draw(0,true);
  bag.add(board.unregister);bag.add(()=>svg.replaceChildren());
  return {set:v=>{value=clamp(v,0,1);if(value===0)reset();else{stopped=false;phaseStart=null;board.wake();}},destroy:bag.dispose};
}
hairline({name:'conversation',means:'A frontal screen holds an incoming message and a green reply.',rules:[4,5,7,8,9,10],range:[0,0.5,1],tour:[[150,150],[250,180],[200,140],null],mount});
