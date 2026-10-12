const mountedWrappers = new WeakMap();

function active(state, documentRef) {
  return state.visible && !state.reducedMotion && !documentRef.hidden;
}

export function mountHairlineIllustrations({
  items,
  renderers,
  win = window,
  documentRef = document,
  observerFactory = callback => new win.IntersectionObserver(callback),
}) {
  const states = items
    .filter(item => !mountedWrappers.has(item.wrapper))
    .map(item => ({ ...item, visible: false, figure: null, mounting: false, playing: false }));
  if (!states.length) return () => {};

  let destroyed = false;
  const media = win.matchMedia('(prefers-reduced-motion: reduce)');
  const stateByWrapper = new Map(states.map(state => [state.wrapper, state]));
  let reducedMotion = media.matches;

  const release = state => {
    const figure = state.figure;
    state.figure = null;
    state.playing = false;
    delete state.wrapper.dataset.ready;
    if (figure?.destroy) {
      try { figure.destroy(); } catch { /* Preserve the static fallback if a renderer fails during teardown. */ }
    }
  };

  const updateFigure = (state, visible = active(state, documentRef)) => {
    if (!state.figure) return;
    try {
      if (state.authoredMotion) state.figure.update?.({ visible });
      else if (state.playOnVisible && state.playing !== visible) {
        state.figure.update?.({ play: visible });
        state.playing = visible;
      }
    } catch {
      release(state);
    }
  };

  const mountFigure = state => {
    if (destroyed || reducedMotion || !state.visible || state.figure || state.mounting) return;
    state.mounting = true;
    const options = { theme: 'auto', label: state.label };
    if (state.authoredMotion && state.interactionTarget) options.interactionTarget = state.interactionTarget;
    if (state.playOnVisible) {
      options.play = !documentRef.hidden;
      state.playing = options.play;
    }
    Promise.resolve()
      .then(() => renderers[state.type](state.host, options))
      .then(figure => {
        state.mounting = false;
        if (destroyed || reducedMotion || !state.visible) {
          figure?.destroy?.();
          return;
        }
        state.figure = figure;
        state.wrapper.dataset.ready = 'true';
        updateFigure(state);
      })
      .catch(() => {
        state.mounting = false;
        state.playing = false;
      });
  };

  const sync = state => {
    if (!state.visible || reducedMotion) {
      updateFigure(state, false);
      return;
    }
    if (!state.figure) mountFigure(state);
    else updateFigure(state);
  };

  const onMotion = event => {
    reducedMotion = event.matches;
    for (const state of states) {
      if (reducedMotion) release(state);
      else sync(state);
    }
  };
  const onVisibility = () => {
    for (const state of states) {
      if (state.authoredMotion) updateFigure(state, active(state, documentRef));
      else if (state.playOnVisible && state.figure) updateFigure(state, active(state, documentRef));
      else if (!documentRef.hidden) sync(state);
    }
  };
  const observer = observerFactory(entries => {
    for (const entry of entries) {
      const state = stateByWrapper.get(entry.target);
      if (!state) continue;
      state.visible = Boolean(entry.isIntersecting);
      sync(state);
    }
  });

  function dispose() {
    if (destroyed) return;
    destroyed = true;
    media.removeEventListener('change', onMotion);
    documentRef.removeEventListener('visibilitychange', onVisibility);
    observer.disconnect();
    for (const state of states) {
      if (mountedWrappers.get(state.wrapper) === dispose) mountedWrappers.delete(state.wrapper);
      release(state);
      state.mounting = false;
    }
  }

  for (const state of states) {
    mountedWrappers.set(state.wrapper, dispose);
    observer.observe(state.wrapper);
  }
  media.addEventListener('change', onMotion);
  documentRef.addEventListener('visibilitychange', onVisibility);
  return dispose;
}
