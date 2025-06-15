import { ArrayBufferToUrl } from "@/feature/pd/utils/array-buffer-to-url";
import { useS3Image } from "@/hooks/use-s3-image";
import Image from "next/image";

interface PdImageProps {
  imageFileName: string | null;
}

export const PdImage = ({ imageFileName }: PdImageProps) => {
  const { data: pdImage } = useS3Image(imageFileName);

  return (
    <>
      {pdImage && (
        <div className="flex justify-center mt-4">
          <div className="rounded-lg overflow-hidden">
            <Image
              src={ArrayBufferToUrl(pdImage)}
              alt="PD Image"
              width={500}
              height={500}
              style={{ maxHeight: "350px", width: "auto", height: "auto" }}
            />
          </div>
        </div>
      )}
    </>
  );
};
