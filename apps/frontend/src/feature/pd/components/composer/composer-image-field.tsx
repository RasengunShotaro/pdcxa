"use client";

import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Control, useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { ComposerSchema } from "./composer-schema";

interface ComposerImageFieldProps {
  control: Control<ComposerSchema>;
  disabled?: boolean;
}

export function ComposerImageField({
  control,
  disabled,
}: ComposerImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {
    field,
    fieldState: { error },
  } = useController({ control, name: "image" });

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    },
    [],
  );

  const selectFile = (file: File | undefined) => {
    field.onChange(file ?? undefined);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    selectFile(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        accept="image/*"
        aria-label="画像ファイルを選択"
        className="hidden"
        disabled={disabled}
        onChange={(event) => selectFile(event.target.files?.[0])}
        ref={inputRef}
        type="file"
      />

      {previewUrl && field.value ? (
        <div className="relative w-fit">
          {/** biome-ignore lint/performance/noImgElement: ローカルの ObjectURL プレビューで next/image は不可 */}
          <img
            alt="添付する画像のプレビュー"
            className="max-h-40 rounded-lg border border-border object-contain"
            src={previewUrl}
          />
          <Button
            aria-label="画像を削除"
            className="absolute top-1.5 right-1.5 size-8 rounded-full bg-background/80 backdrop-blur"
            disabled={disabled}
            onClick={removeFile}
            size="icon"
            type="button"
            variant="outline"
          >
            <X aria-hidden="true" className="size-4" />
          </Button>
        </div>
      ) : (
        <Button
          className="text-muted-foreground"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          type="button"
          variant="outline"
        >
          <ImagePlus aria-hidden="true" className="size-4" />
          画像を追加
        </Button>
      )}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
