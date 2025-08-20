const リサイズ後の寸法を計算する = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
) => {
  const widthRatio = maxWidth / originalWidth;
  const heightRatio = maxHeight / originalHeight;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio),
  };
};

export const 画像をリサイズする = async (image: File): Promise<File> => {
  if (image.type === "image/gif") {
    return image;
  }

  const maxWidth = 1920;
  const maxHeight = 1920;

  const imageBitmap = await createImageBitmap(image);
  const { width, height } = imageBitmap;

  const { width: newWidth, height: newHeight } = リサイズ後の寸法を計算する(
    width,
    height,
    maxWidth,
    maxHeight,
  );
  if (newWidth === width && newHeight === height) {
    return image;
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
