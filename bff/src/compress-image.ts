import { optimizeImage } from "wasm-image-optimization/next-api";

export const compressImage = async ({
  input,
  maxSizeKB = 150,
}: {
  input: Blob;
  maxSizeKB?: number;
}) => {
  const image = await input.arrayBuffer();
  const initialQuality = 100;
  const maxSizeBytes = maxSizeKB * 1024;

  let quality = initialQuality;
  let outputBuffer: Uint8Array;
  let currentSize: number;

  do {
    outputBuffer = (await optimizeImage({
      image: image,
      format: "webp",
      quality: quality,
    })) as Uint8Array;

    currentSize = outputBuffer.length;

    if (currentSize > maxSizeBytes && quality > 10) {
      quality -= 10;
    } else {
      break;
    }
  } while (currentSize > maxSizeBytes);

  if (currentSize > maxSizeBytes) {
    throw new Error(
      `圧縮後の画像サイズが${maxSizeKB}KBを超えました。最終サイズ: ${(
        currentSize / 1024
      ).toFixed(2)}KB`
    );
  }

  return outputBuffer;
};
