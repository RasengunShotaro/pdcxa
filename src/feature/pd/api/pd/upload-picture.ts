import { compressImage } from "@/utils/compress-image";
import { uploadBufferToS3 } from "./upload-buffer-to-s3";

export const uploadPicture = async ({
  blob,
  fileName,
}: {
  blob?: Blob;
  fileName: string;
}) => {
  if (!blob) {
    return null;
  }

  const buffer = Buffer.from(await blob.arrayBuffer());
  const compressedBuffer = await compressImage({
    input: buffer,
    maxSizeKB: 200,
  });

  const url = await uploadBufferToS3({
    buffer: compressedBuffer,
    fileName,
    contentType: blob.type,
    extension: "webp",
  });

  return url;
};
