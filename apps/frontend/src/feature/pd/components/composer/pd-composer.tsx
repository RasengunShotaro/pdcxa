"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ImagePlus, Loader2, Send, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import type { QuotedPd } from "@/feature/pd/types";
import { 投稿失敗の表示を決める } from "@/feature/pd/utils/quote";
import { useCreatePd } from "@/hooks/use-create-pd";
import { QuotedPdCard } from "../timeline/quoted-pd-card";
import { ComposerContentField } from "./composer-content-field";
import {
  type ComposerSchema,
  canSubmitContent,
  composerSchema,
} from "./composer-schema";
import { useComposerImage } from "./use-composer-image";

interface PdComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotedPd?: QuotedPd;
}

export function PdComposer({ open, onOpenChange, quotedPd }: PdComposerProps) {
  const form = useForm<ComposerSchema>({
    resolver: standardSchemaResolver(composerSchema),
    defaultValues: { content: "", image: undefined },
    mode: "onChange",
  });

  const { createPd, isPending } = useCreatePd();
  const [submitError, setSubmitError] = useState<unknown>(null);
  const isQuoting = quotedPd !== undefined;

  const content = useWatch({ control: form.control, name: "content" }) ?? "";
  const {
    inputRef,
    previewUrl,
    value: imageValue,
    error: imageError,
    selectFile,
    removeFile,
    openPicker,
  } = useComposerImage(form.control);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSubmitError(null);
    }
    onOpenChange(next);
  };

  const onSubmit = async (values: ComposerSchema) => {
    setSubmitError(null);
    try {
      await createPd({
        content: values.content.trim(),
        image: values.image,
        quotedPd,
      });
      toast.success(isQuoting ? "引用してPDしました" : "PDしました");
      form.reset({ content: "", image: undefined });
      onOpenChange(false);
    } catch (error) {
      setSubmitError(error);
      toast.error(投稿失敗の表示を決める({ error, isQuoting }).message);
    }
  };

  const submitErrorDisplay = submitError
    ? 投稿失敗の表示を決める({ error: submitError, isQuoting })
    : null;

  const canSubmit = canSubmitContent(content) && !isPending;

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent
        className="sm:max-w-[480px]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById("pd-composer-content")?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{isQuoting ? "引用してPDする" : "PDする"}</DialogTitle>
          <DialogDescription className="sr-only">
            PDはタイムラインに公開されます。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            aria-busy={isPending}
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ComposerContentField control={form.control} disabled={isPending} />

            {quotedPd ? (
              <QuotedPdCard linked={false} quotedPd={quotedPd} />
            ) : null}

            <input
              accept="image/*"
              aria-label="画像ファイルを選択"
              className="hidden"
              disabled={isPending}
              onChange={(event) => selectFile(event.target.files?.[0])}
              ref={inputRef}
              type="file"
            />

            {previewUrl && imageValue ? (
              <div className="relative mx-auto w-fit">
                {/** biome-ignore lint/performance/noImgElement: ローカルの ObjectURL プレビューで next/image は不可 */}
                <img
                  alt="添付する画像のプレビュー"
                  className="max-h-40 rounded-lg border border-border object-contain"
                  src={previewUrl}
                />
                <Button
                  aria-label="画像を削除"
                  className="absolute top-1.5 right-1.5 size-8 rounded-full bg-background/80 backdrop-blur"
                  disabled={isPending}
                  onClick={removeFile}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <X aria-hidden="true" className="size-4" />
                </Button>
              </div>
            ) : null}

            {imageError ? (
              <p className="text-sm text-destructive" role="alert">
                {imageError.message}
              </p>
            ) : null}

            {submitErrorDisplay ? (
              <Alert
                variant={
                  submitErrorDisplay.kind === "retryable"
                    ? "default"
                    : "destructive"
                }
              >
                <TriangleAlert />
                <AlertDescription>
                  {submitErrorDisplay.message}
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="flex items-center justify-between">
              <Button
                className="text-muted-foreground"
                disabled={isPending}
                onClick={openPicker}
                type="button"
                variant="outline"
              >
                <ImagePlus aria-hidden="true" className="size-4" />
                画像を追加
              </Button>
              <Button disabled={!canSubmit} type="submit">
                {isPending ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : (
                  <Send aria-hidden="true" className="size-4" />
                )}
                PDする
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
