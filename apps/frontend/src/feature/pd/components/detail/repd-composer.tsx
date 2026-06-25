"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, Send, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { errorDisplay } from "@/lib/error-message";
import { cn } from "@/lib/utils";
import {
  canSubmitContent,
  isContentOverLimit,
  MAX_CONTENT_LENGTH,
  remainingChars,
} from "../composer/composer-schema";
import {
  type RePdComposerSchema,
  rePdComposerSchema,
} from "./repd-composer-schema";

interface RePdComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRePd: (content: string) => Promise<void>;
  isPending: boolean;
}

export function RePdComposer({
  open,
  onOpenChange,
  onSubmitRePd,
  isPending,
}: RePdComposerProps) {
  const form = useForm<RePdComposerSchema>({
    resolver: standardSchemaResolver(rePdComposerSchema),
    defaultValues: { content: "" },
    mode: "onChange",
  });
  const [submitError, setSubmitError] = useState<unknown>(null);

  const {
    field,
    fieldState: { error },
  } = useController({ control: form.control, name: "content" });

  const content = field.value ?? "";
  const remaining = remainingChars(content);
  const overLimit = isContentOverLimit(content);
  const canSubmit = canSubmitContent(content) && !isPending;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSubmitError(null);
    }
    onOpenChange(next);
  };

  const onSubmit = async (values: RePdComposerSchema) => {
    setSubmitError(null);
    try {
      await onSubmitRePd(values.content.trim());
      toast.success("RePD しました");
      form.reset({ content: "" });
      onOpenChange(false);
    } catch (caught) {
      setSubmitError(caught);
      toast.error(errorDisplay(caught).message);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent
        className="sm:max-w-[480px]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById("repd-composer-content")?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>RePDする</DialogTitle>
          <DialogDescription className="sr-only">
            この PD への返信を投稿します。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            aria-busy={isPending}
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <label className="sr-only" htmlFor="repd-composer-content">
                返信の本文
              </label>
              <Textarea
                aria-describedby="repd-composer-counter"
                aria-invalid={error !== undefined || overLimit}
                className="min-h-32 resize-none text-base"
                disabled={isPending}
                id="repd-composer-content"
                placeholder="この PD に感じたこと・気づいたことを返信しよう"
                {...field}
              />
              <div className="flex items-center justify-between">
                {error ? (
                  <p className="text-destructive text-sm" role="alert">
                    {error.message}
                  </p>
                ) : (
                  <span aria-hidden="true" />
                )}
                <span
                  aria-live="polite"
                  className={cn(
                    "shrink-0 text-sm tabular-nums",
                    overLimit
                      ? "font-medium text-destructive"
                      : "text-muted-foreground",
                  )}
                  id="repd-composer-counter"
                >
                  残り {remaining} / {MAX_CONTENT_LENGTH}
                </span>
              </div>
            </div>

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
                  className="mr-auto flex items-center text-muted-foreground text-sm"
                >
                  送信中…
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
                RePDする
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
