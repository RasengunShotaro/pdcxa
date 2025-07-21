import Image from "next/image";
import { useEffect } from "react";
import {
  ArrayBufferToUrl,
  revokeArrayBufferUrl,
} from "@/feature/pd/utils/array-buffer-to-url";
import { useS3Image } from "@/hooks/use-s3-image";

interface PdImageProps {
  imageFileName: string | null;
}

export const PdImage = ({ imageFileName }: PdImageProps) => {
  const { data: pdImage } = useS3Image(imageFileName);

  useEffect(() => {
    return () => {
      if (pdImage) {
        revokeArrayBufferUrl(pdImage);
      }
    };
  }, [pdImage]);

  return (
    <>
      {pdImage && (
        <div className="flex justify-center mt-4">
          <div className="rounded-lg overflow-hidden">
            <Image
              alt="PD Image"
              height={500}
              src={ArrayBufferToUrl(pdImage)}
              style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              width={500}
            />
          </div>
        </div>
      )}
    </>
  );
};
