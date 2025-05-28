export const resizeImage = async (
  imageBuffer: ArrayBuffer
): Promise<ArrayBuffer> => {
  const maxWidth = 1920;
  const maxHeight = 1920;
  const blob = new Blob([imageBuffer], { type: "image/jpeg" });

  const imageBitmap = await createImageBitmap(blob);
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
      "画像リサイズに失敗しました: コンテキストが取得できませんでした"
    );
  }

  ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);
  const resizedBlob = await canvas.convertToBlob({
    type: "image/jpeg",
  });

  return await resizedBlob.arrayBuffer();
};
