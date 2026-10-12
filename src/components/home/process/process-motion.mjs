export function setupProcessMotion({ element, media, Observer = globalThis.IntersectionObserver, setComplete }) {
  let finished = false;
  let observer;
  const complete = () => {
    if (finished) return;
    finished = true;
    setComplete(true);
    observer?.unobserve(element);
    observer?.disconnect();
  };
  const onPreferenceChange = (event) => {
    if (event.matches) complete();
  };

  if (media.matches || typeof Observer !== "function") complete();
  else {
    observer = new Observer((entries) => {
      if (entries.some((entry) => entry.target === element && entry.isIntersecting)) complete();
    });
    observer.observe(element);
  }
  media.addEventListener?.("change", onPreferenceChange);

  const cleanup = () => {
    observer?.disconnect();
    media.removeEventListener?.("change", onPreferenceChange);
  };
  cleanup.observer = observer;
  return cleanup;
}
