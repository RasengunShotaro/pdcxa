export const ArrayBufferToUrl = (image: ArrayBuffer) => {
  const blob = new Blob([image], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
};
