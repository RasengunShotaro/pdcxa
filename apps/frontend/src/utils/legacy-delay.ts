export const legacyDelay = () => {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }
  if (!document.documentElement.classList.contains("legacy")) {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 8000);
  });
};
