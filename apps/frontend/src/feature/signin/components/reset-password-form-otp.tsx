"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PasswordInput } from "@/components/ui/password-input";
import type { SignInFlow } from "@/lib/auth/types";
import { useSignInFlow } from "@/lib/auth/use-sign-in";
import {
  type ResetPasswordFormSchema,
  resetPasswordFormSchema,
} from "../types/reset-form";

const RESET_FAILED = "問題が発生しました";
const RESET_FAILED_DETAIL = "再度お試しください";

interface ResetPasswordOtpFormProps {
  flow?: SignInFlow;
}

export function ResetPasswordOtpForm({ flow }: ResetPasswordOtpFormProps) {
  const router = useRouter();
  const seam = useSignInFlow();
  const signIn = flow ?? seam.signIn;
  const [isPending, startTransition] = useTransition();
  const [hasError, setHasError] = useState(false);

  const form = useForm<ResetPasswordFormSchema>({
    resolver: standardSchemaResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormSchema) => {
    setHasError(false);
    startTransition(async () => {
      const { error: verifyError } =
        await signIn.resetPasswordEmailCode.verifyCode({
          code: values.code,
        });

      if (verifyError) {
        setHasError(true);
        toast.error(RESET_FAILED, { description: RESET_FAILED_DETAIL });
        return;
      }

      const { error: submitError } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password: values.password,
        });

      if (submitError) {
        setHasError(true);
        toast.error(RESET_FAILED, { description: RESET_FAILED_DETAIL });
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
        toast.success("パスワードが正常にリセットされました。");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        aria-busy={isPending}
        className="grid gap-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>新しいパスワード</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="8文字以上のパスワード"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>新しいパスワード再入力</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  placeholder="同じパスワードをもう一度"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>確認コード</FormLabel>
              <FormControl>
                <InputOTP
                  aria-label="確認コード（6桁）"
                  containerClassName="justify-center"
                  maxLength={6}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{RESET_FAILED_DETAIL}</AlertDescription>
          </Alert>
        ) : null}

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Check aria-hidden="true" className="size-4" />
          )}
          パスワードをリセット
        </Button>
      </form>
    </Form>
  );
}
