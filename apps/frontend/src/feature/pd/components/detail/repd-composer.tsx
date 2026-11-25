"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowUp, Loader2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useController, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { errorDisplay } from "@/lib/error-message";
import { cn } from "@/lib/utils";
import {
  canSubmitContent,
  counterAnnouncement,
  isContentOverLimit,
  MAX_CONTENT_LENGTH,
  remainingChars,
} from "../composer/composer-schema";
import {
  type RePdComposerSchema,
  rePdComposerSchema,
} from "./repd-composer-schema";

interface RePdComposerProps {
  onSubmitRePd: (content: string) => Promise<void>;
  isPending: boolean;
}

export function RePdComposer({ onSubmitRePd, isPending }: RePdComposerProps) {
  const { user } = useCurrentUser();
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
  const displayName = user?.fullName ?? "ユーザー";

  const onSubmit = async (values: RePdComposerSchema) => {
    setSubmitError(null);
    try {
      await onSubmitRePd(values.content.trim());
      toast.success("RePDしました");
      form.reset({ content: "" });
    } catch (caught) {
      setSubmitError(caught);
      toast.error(errorDisplay(caught).message);
    }
  };

  return (
    <div
      className="sticky bottom-0 z-[2] -mx-6 mt-auto bg-bar-surface px-6 pt-2 pb-6 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-10 before:bg-linear-to-b before:from-transparent before:to-bar-surface max-wide:-mx-4 max-wide:px-4 max-wide:pb-[104px]"
      data-reply-bar=""
    >
      <Form {...form}>
        <form
          aria-busy={isPending}
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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

          <div className="flex items-end gap-3 rounded-3xl bg-fill-solid p-3 ring-1 ring-line focus-within:ring-2 focus-within:ring-brand">
            <Avatar className="size-[34px] shrink-0 max-wide:hidden">
              <AvatarImage alt="" src={user?.imageUrl} />
              <AvatarFallback className="bg-brand-soft text-xs font-bold text-ink">
                {avatarInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <label className="sr-only" htmlFor="repd-composer-content">
              返信の本文
            </label>
            <textarea
              aria-describedby="repd-composer-counter"
              aria-invalid={error !== undefined || overLimit}
              className="max-h-40 min-h-[34px] min-w-0 flex-1 resize-none border-0 bg-transparent py-[5px] text-[0.9375rem] leading-[1.6] text-ink outline-none [field-sizing:content] placeholder:text-ink-3 disabled:opacity-60"
              disabled={isPending}
              id="repd-composer-content"
              placeholder="このPDに感じたこと・気づいたことを返信しよう"
              rows={1}
              {...field}
              onChange={(event) => {
                setSubmitError(null);
                field.onChange(event);
              }}
            />
            <Button
              className="h-[34px] shrink-0 gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-bold transition-[scale,opacity] hover:scale-[1.03] disabled:bg-fill-hover disabled:text-ink-3 disabled:opacity-100"
              disabled={!canSubmit}
              type="submit"
            >
              {isPending ? (
                <Loader2
                  aria-hidden="true"
                  className="size-[15px] animate-spin"
                />
              ) : (
                <ArrowUp aria-hidden="true" className="size-[15px]" />
              )}
              RePDする
            </Button>
          </div>

          <span aria-live="polite" className="sr-only">
            {isPending ? "送信中…" : counterAnnouncement(content)}
          </span>
          <div
            className={cn(
              "flex items-center justify-between gap-3 px-3",
              content.length === 0 && !error && "hidden",
            )}
          >
            {error ? (
              <p className="text-[0.8125rem] text-destructive" role="alert">
                {error.message}
              </p>
            ) : (
              <span aria-hidden="true" />
            )}
            <span
              className={cn(
                "shrink-0 text-[0.8125rem] tabular-nums",
                overLimit ? "font-bold text-destructive" : "text-ink-3",
              )}
              id="repd-composer-counter"
            >
              残り {remaining} / {MAX_CONTENT_LENGTH}
            </span>
          </div>
        </form>
      </Form>
    </div>
  );
}
