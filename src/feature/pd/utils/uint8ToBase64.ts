export const Uint8ArrayToBase64Image = (image: Uint8Array) =>
  `data:image/jpeg;base64,${btoa(String.fromCharCode(...image))}`;
