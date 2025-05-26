import { optimizeImage } from "wasm-image-optimization";

export const compressImage = async ({
  image,
  quality,
}: {
  image: ArrayBuffer;
  quality: number;
}) =>
  (await optimizeImage({
    image: image,
    format: "webp",
    quality: quality,
    speed: 10,
  })) as Uint8Array;
