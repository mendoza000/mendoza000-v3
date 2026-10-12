import { conversation } from '../../../../public/hairline/contact-conversation-figure.mjs';
export function mountContactConversation(root) {
  const stage=root.querySelector('[data-conversation-stage]'), svg=stage?.querySelector(':scope > svg'), read=root.querySelector('[data-conversation-read]');
  const media=matchMedia('(prefers-reduced-motion: reduce)'); let mount,visible=false,disposed=false;
  const stop=()=>{mount?.destroy();mount=undefined;delete root.dataset.mounted;};
  const start=()=>{if(disposed||mount||media.matches||document.hidden||!visible)return;try{mount=conversation.mount({stage,svg,read},media.matches?0:.5);root.dataset.mounted='true';}catch{svg?.replaceChildren();stop();}};
  const observer=new IntersectionObserver(([entry])=>{visible=!!entry?.isIntersecting;if(visible)start();else stop();},{rootMargin:'100px'});observer.observe(root);
  const motion=()=>media.matches?stop():start(), visibility=()=>document.hidden?stop():start();
  media.addEventListener('change',motion);document.addEventListener('visibilitychange',visibility);
  return()=>{disposed=true;observer.disconnect();media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility);stop();};
}
const instances=new WeakMap();
function boot(){document.querySelectorAll('[data-contact-conversation]').forEach(root=>{instances.get(root)?.();instances.set(root,mountContactConversation(root));});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('astro:page-load',boot);
document.addEventListener('astro:before-swap',()=>{for(const root of document.querySelectorAll('[data-contact-conversation]')){instances.get(root)?.();instances.delete(root);}});
