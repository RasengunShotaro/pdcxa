"use client";

import { ImageUp, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as v from "valibot";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import { imageFormSchema } from "../types/profile-picture";

interface ProfilePictureFieldProps {
  imageUrl: string;
  displayName: string;
  onUpload: (file: Blob | File) => Promise<void>;
}

type PictureFeedback =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const UPLOAD_FAILED_MESSAGE =
  "画像のアップロードに失敗しました。時間をおいて再試行してください。";

export function ProfilePictureField({
  imageUrl,
  displayName,
  onUpload,
}: ProfilePictureFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<PictureFeedback>({ kind: "idle" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!previewUrl) {
      return;
    }
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const isUploading = feedback.kind === "uploading";

  const onSelectFile = async (file: File) => {
    const parsed = v.safeParse(imageFormSchema, { image: file });
    if (!parsed.success) {
      setFeedback({ kind: "error", message: parsed.issues[0].message });
      return;
    }

    setFeedback({ kind: "uploading" });
    try {
      await onUpload(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFeedback({ kind: "success" });
      toast.success("画像を変更しました");
    } catch {
      setFeedback({ kind: "error", message: UPLOAD_FAILED_MESSAGE });
      toast.error("画像のアップロードに失敗しました");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="size-24">
        <AvatarImage alt={displayName} src={previewUrl ?? imageUrl} />
        <AvatarFallback className="text-2xl">
          {avatarInitials(displayName)}
        </AvatarFallback>
      </Avatar>

      <input
        accept="image/*"
        aria-label="プロフィール画像ファイルを選択"
        className="hidden"
        disabled={isUploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) {
            void onSelectFile(file);
          }
        }}
        ref={inputRef}
        type="file"
      />
      <Button
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        type="button"
        variant="outline"
      >
        {isUploading ? <Loader2 className="animate-spin" /> : <ImageUp />}
        画像を変更する
      </Button>

      <p
        aria-live="polite"
        className="text-sm text-muted-foreground"
        role="status"
      >
        {feedback.kind === "uploading" && "アップロード中…"}
        {feedback.kind === "success" && "画像を変更しました"}
      </p>

      {feedback.kind === "error" && (
        <Alert role="alert" variant="destructive">
          <AlertDescription>{feedback.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
