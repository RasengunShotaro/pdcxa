export const R2に画像をアップロードする = async ({
  body,
  fileName,
  contentType,
  extension,
  R2,
}: {
  body: Uint8Array | Blob;
  fileName: string;
  contentType: string;
  extension: string;
  R2: R2Bucket;
}) => {
  const fullFileName = `${fileName}.${extension}`;

  await R2.put(fullFileName, body, {
    httpMetadata: {
      contentType,
    },
  });

  return fullFileName;
};

export const R2から指定した名前の画像を取得する = async ({
  fullFileName,
  R2,
}: {
  fullFileName: string;
  R2: R2Bucket;
}) => {
  const response = await R2.get(fullFileName);

  const data = await new Response(response?.body).arrayBuffer();

  if (!data) {
    throw new Error("画像データ取得に失敗しました");
  }

  return data;
};
