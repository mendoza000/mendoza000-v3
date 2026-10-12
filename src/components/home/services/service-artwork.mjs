const artGroups = {
  gateway: 'payment-card',
  maintenance: 'adjustment-wrench',
};

const activeArtworks = new Set();
const loopDuration = 12_000;
let animationFrame = null;
let animationWindow = null;

function active(state) {
  return !state.destroyed && state.visible && !state.reducedMotion && !state.documentHidden;
}

function needsFrame(state) {
  if (!active(state)) return false;
  return state.interacting ? Math.abs(state.progress - 0.5) > 0.001 : true;
}

function transformFor(type, progress) {
  if (type === 'gateway') {
    const x = 54 + 210 * progress;
    const angle = -2 + 4 * progress;
    return `translate(${x.toFixed(1)} 286) rotate(${angle.toFixed(1)})`;
  }
  const angle = -8 + 16 * progress;
  return `translate(433 86) rotate(${angle.toFixed(1)} 32 48)`;
}

function writeProgress(state, progress) {
  const bounded = Math.min(1, Math.max(0, progress));
  if (Math.abs(state.progress - bounded) < 0.0001) return;
  state.progress = bounded;
  state.movingGroup.setAttribute('transform', transformFor(state.type, bounded));
}

function schedule() {
  if (animationFrame !== null) return;
  const state = [...activeArtworks].find(needsFrame);
  if (!state) return;
  animationWindow = state.win;
  animationFrame = animationWindow.requestAnimationFrame(animate);
}

function stopIfIdle() {
  if ([...activeArtworks].some(needsFrame)) return;
  if (animationFrame !== null) animationWindow.cancelAnimationFrame(animationFrame);
  animationFrame = null;
  animationWindow = null;
}

function animate(timestamp) {
  animationFrame = null;
  for (const state of activeArtworks) {
    if (!active(state)) {
      state.lastTimestamp = null;
      continue;
    }
    const elapsed = state.lastTimestamp === null ? 0 : Math.max(0, timestamp - state.lastTimestamp);
    state.lastTimestamp = timestamp;
    if (state.interacting) {
      const eased = 1 - Math.exp(-elapsed / 220);
      const next = state.progress + (0.5 - state.progress) * eased;
      writeProgress(state, Math.abs(next - 0.5) < 0.001 ? 0.5 : next);
    } else {
      state.phase = (state.phase + elapsed / loopDuration) % 1;
      writeProgress(state, 0.5 - 0.5 * Math.cos(state.phase * Math.PI * 2));
    }
  }
  schedule();
}

function updateInteraction(state) {
  state.interacting = state.pointerInside || state.focusInside;
  if (!state.interacting && state.progress !== 0.5) {
    state.phase = Math.acos(1 - 2 * state.progress) / (Math.PI * 2);
  }
  schedule();
  stopIfIdle();
}

async function fetchSvg(src) {
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Could not load service artwork: ${src}`);
  return response.text();
}

function parseSvg(source) {
  const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
  if (parsed.querySelector('parsererror')) throw new Error('Invalid service SVG');
  return parsed.documentElement;
}

export async function createServiceArtwork(host, {
  type,
  label,
  src,
  loadSvg = fetchSvg,
  parse = parseSvg,
  win = window,
  documentRef = document,
  interactionTarget = host,
}) {
  const groupName = artGroups[type];
  if (!groupName) throw new TypeError(`Unknown authored service artwork: ${type}`);
  const source = await loadSvg(src);
  const parsedSvg = parse(source);
  const svg = host.ownerDocument?.importNode ? host.ownerDocument.importNode(parsedSvg, true) : parsedSvg;
  const movingGroup = svg?.querySelector?.(`[data-art="${groupName}"]`);
  if (!svg || svg.localName !== 'svg' || !movingGroup) throw new Error(`Service artwork is missing its ${groupName} group`);

  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);
  svg.setAttribute('focusable', 'false');
  host.appendChild(svg);

  const media = win.matchMedia('(prefers-reduced-motion: reduce)');
  const state = {
    type,
    win,
    documentRef,
    interactionTarget,
    movingGroup,
    progress: 0.5,
    phase: 0,
    lastTimestamp: null,
    visible: false,
    interacting: false,
    pointerInside: false,
    focusInside: false,
    reducedMotion: media.matches,
    documentHidden: documentRef.hidden,
    destroyed: false,
  };
  movingGroup.setAttribute('transform', transformFor(type, state.progress));
  activeArtworks.add(state);

  const onPointerEnter = () => { state.pointerInside = true; updateInteraction(state); };
  const onPointerLeave = () => { state.pointerInside = false; updateInteraction(state); };
  const onFocusIn = () => { state.focusInside = true; updateInteraction(state); };
  const onFocusOut = event => {
    if (event.relatedTarget && interactionTarget.contains?.(event.relatedTarget)) return;
    state.focusInside = false;
    updateInteraction(state);
  };
  const onMotion = event => {
    state.reducedMotion = event.matches;
    state.lastTimestamp = null;
    schedule();
    stopIfIdle();
  };
  const onVisibility = () => {
    state.documentHidden = documentRef.hidden;
    state.lastTimestamp = null;
    schedule();
    stopIfIdle();
  };

  interactionTarget.addEventListener('pointerenter', onPointerEnter);
  interactionTarget.addEventListener('pointerleave', onPointerLeave);
  interactionTarget.addEventListener('focusin', onFocusIn);
  interactionTarget.addEventListener('focusout', onFocusOut);
  media.addEventListener('change', onMotion);
  documentRef.addEventListener('visibilitychange', onVisibility);

  return {
    update({ visible } = {}) {
      if (state.destroyed || typeof visible !== 'boolean') return;
      state.visible = visible;
      state.lastTimestamp = null;
      schedule();
      stopIfIdle();
    },
    destroy() {
      if (state.destroyed) return;
      state.destroyed = true;
      activeArtworks.delete(state);
      interactionTarget.removeEventListener('pointerenter', onPointerEnter);
      interactionTarget.removeEventListener('pointerleave', onPointerLeave);
      interactionTarget.removeEventListener('focusin', onFocusIn);
      interactionTarget.removeEventListener('focusout', onFocusOut);
      media.removeEventListener('change', onMotion);
      documentRef.removeEventListener('visibilitychange', onVisibility);
      svg.remove();
      stopIfIdle();
    },
  };
}
