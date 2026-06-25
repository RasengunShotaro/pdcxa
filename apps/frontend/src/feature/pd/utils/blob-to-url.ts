const objectUrlCache = new WeakMap<Blob, string>();

export const blobToObjectUrl = (blob: Blob): string => {
  const cachedUrl = objectUrlCache.get(blob);
  if (cachedUrl) {
    return cachedUrl;
  }

  const url = URL.createObjectURL(blob);
  objectUrlCache.set(blob, url);

  return url;
};
