export const legacyDelay = (ms = 600) => {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }
  if (!document.documentElement.classList.contains("legacy")) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};
