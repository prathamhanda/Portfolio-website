import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type PreloaderProps = {
  /** Milliseconds the logo takes to enter */
  enterDurationMs?: number;
  /** Override: milliseconds before the preloader starts exiting */
  exitAfterMs?: number;
  /** Milliseconds the exit animation takes */
  exitDurationMs?: number;
  onDone?: () => void;
  className?: string;
};

export default function Preloader({
  enterDurationMs = 1500,
  exitAfterMs,
  exitDurationMs = 800,
  onDone,
  className,
}: PreloaderProps) {
  const [exiting, setExiting] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const resolvedEnterMs = prefersReducedMotion ? 0 : enterDurationMs;
    const resolvedExitAfterMs = exitAfterMs ?? resolvedEnterMs;
    const resolvedExitDurationMs = prefersReducedMotion ? 0 : exitDurationMs;

    const startExit = window.setTimeout(() => {
      setExiting(true);
    }, resolvedExitAfterMs);

    const done = window.setTimeout(() => {
      onDone?.();
    }, resolvedExitAfterMs + resolvedExitDurationMs);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(startExit);
      window.clearTimeout(done);
    };
  }, [enterDurationMs, exitAfterMs, exitDurationMs, onDone, prefersReducedMotion]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={cn(
        "fixed inset-0 z-[10000] bg-white",
        "flex items-center justify-center",
        "transform-gpu transition-transform ease-in-out",
        prefersReducedMotion ? "duration-0" : "duration-700",
        exiting ? "-translate-y-full" : "translate-y-0",
        className
      )}
    >
      <img
        src="/preloader.svg"
        alt=""
        className={cn(
          "h-auto w-[220px] select-none",
          "animate-preloader-logo-in",
          prefersReducedMotion && "animate-none"
        )}
        draggable={false}
      />
    </div>
  );
}
