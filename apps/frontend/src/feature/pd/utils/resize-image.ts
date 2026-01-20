import { legacyDelay } from "@/utils/legacy-delay";

export const resizeImage = async (image: File): Promise<File> => {
  await legacyDelay();
  const maxWidth = 1920;
  const maxHeight = 1920;

  const imageBitmap = await createImageBitmap(image);
  const originalWidth = imageBitmap.width;
  const originalHeight = imageBitmap.height;

  let newWidth = originalWidth;
  let newHeight = originalHeight;

  if (originalWidth > maxWidth) {
    newWidth = maxWidth;
    newHeight = (originalHeight * maxWidth) / originalWidth;
  }
  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = (originalWidth * maxHeight) / originalHeight;
  }

  const canvas = new OffscreenCanvas(newWidth, newHeight);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "画像リサイズに失敗しました: コンテキストが取得できませんでした",
    );
  }

  ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);
  const resizedBlob = await canvas.convertToBlob({
    type: "image/jpeg",
  });

  return new File([resizedBlob], image.name);
};
