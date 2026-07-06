"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UpdateProfileHandleFailureReason } from "@/lib/auth/profile-handle-failure";
import type { UpdateProfileHandleResult } from "@/lib/auth/use-update-profile";
import {
  type HandleFormSchema,
  handleFormSchema,
} from "../types/profile-handle";

interface ProfileHandleFieldProps {
  defaultValues: HandleFormSchema;
  onSubmit: (handle: string) => Promise<UpdateProfileHandleResult>;
}

type Feedback =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; reason: UpdateProfileHandleFailureReason };

const ALERT_MESSAGE: Record<UpdateProfileHandleFailureReason, string> = {
  taken: "このIDは既に使われています。別のIDを入力してください。",
  invalidLength: "IDの文字数が規定に合っていません。別のIDを入力してください。",
  invalidCharacter:
    "IDに使えない文字が含まれています。英数字などで入力してください。",
  needsNonNumberChar:
    "IDは数字だけにできません。英字を1文字以上含めてください。",
  unknown: "IDの変更に失敗しました。時間をおいて再試行してください。",
};

const TOAST_MESSAGE: Record<UpdateProfileHandleFailureReason, string> = {
  taken: "このIDは既に使われています",
  invalidLength: "IDの文字数が規定に合っていません",
  invalidCharacter: "IDに使えない文字が含まれています",
  needsNonNumberChar: "IDは数字だけにできません",
  unknown: "IDの変更に失敗しました",
};

export function ProfileHandleField({
  defaultValues,
  onSubmit,
}: ProfileHandleFieldProps) {
  const [feedback, setFeedback] = useState<Feedback>({ status: "idle" });

  const form = useForm<HandleFormSchema>({
    resolver: standardSchemaResolver(handleFormSchema),
    defaultValues,
  });

  const handleSubmit = async (value: HandleFormSchema) => {
    setFeedback({ status: "idle" });
    try {
      const result = await onSubmit(value.handle);
      if (result.ok) {
        setFeedback({ status: "success" });
        toast.success("IDを変更しました");
        return;
      }
      setFeedback({ status: "error", reason: result.reason });
      toast.error(TOAST_MESSAGE[result.reason]);
    } catch {
      setFeedback({ status: "error", reason: "unknown" });
      toast.error(TOAST_MESSAGE.unknown);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  @
                </span>
                <FormControl>
                  <Input
                    autoCapitalize="none"
                    autoComplete="off"
                    className="pl-7"
                    placeholder="pdcxa"
                    spellCheck={false}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {feedback.status === "error" && (
          <Alert role="alert" variant="destructive">
            <AlertDescription>
              {ALERT_MESSAGE[feedback.reason]}
            </AlertDescription>
          </Alert>
        )}

        <p
          aria-live="polite"
          className="text-sm text-muted-foreground"
          role="status"
        >
          {feedback.status === "success" && "IDを変更しました"}
        </p>

        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Check />
            )}
            保存する
          </Button>
        </div>
      </form>
    </Form>
  );
}
