import { optimizeImage } from "wasm-image-optimization";

const compress = async (
  image: ArrayBuffer,
  quality: number,
): Promise<Uint8Array> => {
  return (await optimizeImage({
    image: image,
    format: "jpeg",
    quality: quality,
    speed: 10,
  })) as Uint8Array;
};

export const compressImage = async ({
  image,
  maxSizeKB = 200,
}: {
  image: File;
  maxSizeKB?: number;
}) => {
  const bufferImage = await image.arrayBuffer();
  const initialQuality = 100;
  const maxSizeBytes = maxSizeKB * 1024;

  let quality = initialQuality;
  let outputBuffer: Uint8Array | undefined;
  let currentSize: number = bufferImage.byteLength;

  do {
    try {
      outputBuffer = await compress(bufferImage, quality);
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
      ).toFixed(2)}KB`,
    );
  }

  return outputBuffer;
};
