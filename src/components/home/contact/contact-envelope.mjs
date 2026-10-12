import { envelope } from "../../../../public/hairline/contact-envelope-figure.mjs";

export function mountContactEnvelope(root) {
  const stage = root.querySelector('[data-envelope-stage]');
  const svg = root.querySelector('[data-envelope-stage] > svg');
  const read = root.querySelector('[data-envelope-read]');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let mount, visible = false, disposed = false;
  const stop = () => {
    mount?.destroy();
    mount = undefined;
    delete root.dataset.mounted;
  };
  const start = () => {
    if (disposed || mount || media.matches || document.hidden || !visible) return;
    try {
      mount = envelope.mount({ stage, svg, read }, 35);
      root.dataset.mounted = 'true';
    } catch {
      stop();
    }
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) start(); else stop();
  }, { rootMargin: '100px' });
  observer.observe(root);
  const motion = () => media.matches ? stop() : start();
  const visibility = () => document.hidden ? stop() : start();
  media.addEventListener('change', motion);
  document.addEventListener('visibilitychange', visibility);
  return () => {
    disposed = true;
    observer.disconnect();
    media.removeEventListener('change', motion);
    document.removeEventListener('visibilitychange', visibility);
    stop();
  };
}

const instances = new WeakMap();
function boot() {
  document.querySelectorAll('[data-contact-envelope]').forEach(root => {
    instances.get(root)?.();
    instances.set(root, mountContactEnvelope(root));
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:before-swap', () => {
  for (const root of document.querySelectorAll('[data-contact-envelope]')) {
    instances.get(root)?.();
    instances.delete(root);
  }
});
