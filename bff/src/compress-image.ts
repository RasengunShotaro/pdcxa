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
  })) as Uint8Array;
