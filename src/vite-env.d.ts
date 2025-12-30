/// <reference types="vite/client" />

// Extend Window interface to include Visual Viewport API
declare global {
  interface Window {
    visualViewport?: VisualViewport;
  }
}

interface VisualViewport extends EventTarget {
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly pageLeft: number;
  readonly pageTop: number;
  readonly width: number;
  readonly height: number;
  readonly scale: number;
}
