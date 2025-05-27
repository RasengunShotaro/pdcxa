export const Uint8ArrayToUrl = (image: Uint8Array) => {
  const blob = new Blob([image], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
};
