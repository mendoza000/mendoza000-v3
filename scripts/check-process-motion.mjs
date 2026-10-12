import assert from "node:assert/strict";
import { setupProcessMotion } from "../src/components/home/process/process-motion.mjs";

function harness({ observer = true, reduced = false } = {}) {
  const state = { complete: false, observed: null, unobserved: null, listener: null, disconnected: false };
  const element = {};
  const media = { matches: reduced, addEventListener(_type, listener) { state.listener = listener; }, removeEventListener() { state.listener = null; } };
  class FakeObserver {
    constructor(callback) { this.callback = callback; }
    observe(target) { state.observed = target; }
    unobserve(target) { state.unobserved = target; }
    disconnect() { state.disconnected = true; }
    enter() { this.callback([{ isIntersecting: true, target: element }]); }
  }
  const clean = setupProcessMotion({ element, media, Observer: observer ? FakeObserver : undefined, setComplete(value) { state.complete = value; } });
  return { state, observer: clean.observer, clean };
}

{
  const h = harness();
  assert.equal(h.state.complete, false, "connectors remain visible until entry");
  assert.equal(h.state.observed != null, true);
  h.observer.enter();
  assert.equal(h.state.complete, true);
  assert.equal(h.state.unobserved != null, true);
  h.observer.enter();
  assert.equal(h.state.complete, true, "entry is one-shot");
  h.clean();
  assert.equal(h.state.listener, null, "media listener is cleaned up");
}
{
  const h = harness({ reduced: true });
  assert.equal(h.state.complete, true, "reduced motion starts in final state");
  h.clean();
}
{
  const h = harness({ observer: false });
  assert.equal(h.state.complete, true, "unsupported observer shows complete connectors");
  h.clean();
}
{
  const h = harness();
  h.observer.enter();
  h.state.listener({ matches: true });
  assert.equal(h.state.complete, true, "preference change completes immediately");
  h.clean();
}
console.log("Process motion behavior passed");
