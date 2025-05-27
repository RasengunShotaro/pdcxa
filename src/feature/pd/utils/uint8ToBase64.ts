export const Uint8ArrayToBase64Image = (image: Uint8Array) => {
  const blob = new Blob([image], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
};
