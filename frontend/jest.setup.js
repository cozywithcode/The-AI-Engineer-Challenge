import "@testing-library/jest-dom";

// Avoid "Not implemented: HTMLCanvasElement.prototype.getContext" in jsdom
HTMLCanvasElement.prototype.getContext = function getContext() {
  return null;
};
