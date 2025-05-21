import sharp from "sharp";

export const compressImage = async ({
  input,
  maxSizeKB,
}: {
  input: Buffer;
  maxSizeKB: number;
}): Promise<Buffer> => {
  const initialQuality = 100;
  const maxSizeBytes = maxSizeKB * 1024;

  if (input.length <= maxSizeBytes) {
    return input;
  }

  const imageProcess = sharp(input);

  let quality = initialQuality;
  let outputBuffer: Buffer;
  let currentSize: number;

  do {
    outputBuffer = await imageProcess
      .webp({
        quality,
        effort: 6,
      })
      .toBuffer();

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
