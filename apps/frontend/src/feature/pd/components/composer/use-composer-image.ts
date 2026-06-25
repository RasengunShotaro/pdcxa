"use client";

import { useEffect, useRef, useState } from "react";
import { type Control, useController } from "react-hook-form";
import type { ComposerSchema } from "./composer-schema";

export function useComposerImage(control: Control<ComposerSchema>) {
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

  const openPicker = () => inputRef.current?.click();

  return {
    inputRef,
    previewUrl,
    value: field.value,
    error,
    selectFile,
    removeFile,
    openPicker,
  };
}
