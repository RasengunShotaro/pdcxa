"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, Send, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreatePd } from "@/hooks/use-create-pd";
import { errorDisplay } from "@/lib/error-message";
import { ComposerContentField } from "./composer-content-field";
import { ComposerImageField } from "./composer-image-field";
import {
  type ComposerSchema,
  canSubmitContent,
  composerSchema,
} from "./composer-schema";

interface PdComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PdComposer({ open, onOpenChange }: PdComposerProps) {
  const form = useForm<ComposerSchema>({
    resolver: standardSchemaResolver(composerSchema),
    defaultValues: { content: "", image: undefined },
    mode: "onChange",
  });

  const { createPd, isPending } = useCreatePd();
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const content = useWatch({ control: form.control, name: "content" }) ?? "";
  const image = useWatch({ control: form.control, name: "image" });

  useEffect(() => {
    if (!(image instanceof File)) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSubmitError(null);
    }
    onOpenChange(next);
  };

  const onSubmit = async (values: ComposerSchema) => {
    setSubmitError(null);
    try {
      await createPd({ content: values.content.trim(), image: values.image });
      toast.success("PD しました");
      form.reset({ content: "", image: undefined });
      onOpenChange(false);
    } catch (error) {
      setSubmitError(error);
      toast.error(errorDisplay(error).message);
    }
  };

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
          <DialogTitle>PDする</DialogTitle>
          <DialogDescription className="sr-only">
            PD はタイムラインに公開されます。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            aria-busy={isPending}
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ComposerContentField control={form.control} disabled={isPending} />
            <ComposerImageField
              control={form.control}
              disabled={isPending}
              previewUrl={previewUrl}
            />

            {submitError ? (
              <Alert
                variant={
                  errorDisplay(submitError).kind === "retryable"
                    ? "default"
                    : "destructive"
                }
              >
                <TriangleAlert />
                <AlertDescription>
                  {errorDisplay(submitError).message}
                </AlertDescription>
              </Alert>
            ) : null}

            <DialogFooter className="gap-2 sm:gap-2">
              {isPending ? (
                <span
                  aria-live="polite"
                  className="mr-auto flex items-center text-sm text-muted-foreground"
                >
                  投稿中…
                </span>
              ) : null}
              <Button
                onClick={() => handleOpenChange(false)}
                type="button"
                variant="outline"
              >
                キャンセル
              </Button>
              <Button disabled={!canSubmit} type="submit">
                {isPending ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : (
                  <Send aria-hidden="true" className="size-4" />
                )}
                PDする
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
