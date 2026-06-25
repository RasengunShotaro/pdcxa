const imageUrlCache = new WeakMap<ArrayBuffer, string>();

export const ArrayBufferToUrl = (image: ArrayBuffer): string => {
  const cachedUrl = imageUrlCache.get(image);
  if (cachedUrl) {
    return cachedUrl;
  }

  const blob = new Blob([image], { type: "image/jpeg" });
  const url = URL.createObjectURL(blob);
  imageUrlCache.set(image, url);

  return url;
};
