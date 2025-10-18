import { useEffect, useRef } from 'react';

interface Options {
  amplitude?: number; // px
  period?: number; // ms for one full cycle
  phase?: number; // phase offset in radians
}

export function useFastFloat(options: Options = {}) {
  const { amplitude = 20, period = 900, phase = 0 } = options;
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function animate(el: HTMLElement | null) {
    if (!el) return () => {};

    // ensure transform-origin is preserved
    el.style.willChange = 'transform';

    const loop = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const phaseTime = (elapsed % period) / period; // 0..1
      const y = Math.sin(phaseTime * 2 * Math.PI + phase) * -amplitude; // negative to float up
      el.style.transform = `translateY(${y}px)`;
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startRef.current = null;
      if (el) el.style.transform = '';
    };
  }

  return { animate };
}
