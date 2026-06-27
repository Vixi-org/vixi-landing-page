import type Lenis from "lenis";

/**
 * Shared handle to the single site-wide Lenis instance created in
 * <SmoothScroll>. Modal-like UI (the cookie gate) needs to lock page scroll,
 * but Lenis hijacks the window scroll, so root `overflow: hidden` alone can't
 * stop it — the modal must call `lenis.stop()` / `.start()`. Null when Lenis
 * isn't running (e.g. a reduced-motion visitor, where native overflow locking
 * is enough).
 */
let instance: Lenis | null = null;

export function setLenisInstance(l: Lenis | null) {
  instance = l;
}

export function getLenisInstance(): Lenis | null {
  return instance;
}
