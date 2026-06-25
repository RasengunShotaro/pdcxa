"use client";

import { type Control, useController } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  type ComposerSchema,
  isContentOverLimit,
  MAX_CONTENT_LENGTH,
  remainingChars,
} from "./composer-schema";

interface ComposerContentFieldProps {
  control: Control<ComposerSchema>;
  disabled?: boolean;
}

export function ComposerContentField({
  control,
  disabled,
}: ComposerContentFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name: "content" });

  const content = field.value ?? "";
  const remaining = remainingChars(content);
  const overLimit = isContentOverLimit(content);

  return (
    <div className="space-y-2">
      <label className="sr-only" htmlFor="pd-composer-content">
        PD の本文
      </label>
      <Textarea
        aria-describedby="pd-composer-counter"
        aria-invalid={error !== undefined || overLimit}
        className="min-h-32 resize-none text-base"
        disabled={disabled}
        id="pd-composer-content"
        placeholder="いま考えていること・気づいたことを書いてみよう"
        {...field}
      />
      <div className="flex items-center justify-between">
        {error ? (
          <p className="text-sm text-destructive" role="alert">
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
          id="pd-composer-counter"
        >
          残り {remaining} / {MAX_CONTENT_LENGTH}
        </span>
      </div>
    </div>
  );
}
