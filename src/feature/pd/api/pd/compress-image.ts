import { getRequestContext } from "@cloudflare/next-on-pages";

export const compressImage = async ({
  image,
  maxSizeKB = 150,
}: {
  image: ArrayBuffer;
  maxSizeKB?: number;
}) => {
  const bff = getRequestContext().env.BFF;
  const initialQuality = 100;
  const maxSizeBytes = maxSizeKB * 1024;

  let quality = initialQuality;
  let outputBuffer: Uint8Array | undefined;
  let currentSize: number = image.byteLength;

  do {
    try {
      outputBuffer = await bff.compress(image, quality);
      currentSize = outputBuffer.length;

      if (currentSize > maxSizeBytes && quality > 10) {
        quality -= 10;
      } else {
        break;
      }
    } catch {
      if (quality > 10) {
        quality -= 10;
      } else {
        break;
      }
    }
  } while (currentSize > maxSizeBytes);

  if (!outputBuffer) {
    throw new Error("画像の圧縮に失敗しました");
  }

  if (currentSize > maxSizeBytes) {
    throw new Error(
      `圧縮後の画像サイズが${maxSizeKB}KBを超えました。最終サイズ: ${(
        currentSize / 1024
      ).toFixed(2)}KB`
    );
  }

  return outputBuffer;
};
