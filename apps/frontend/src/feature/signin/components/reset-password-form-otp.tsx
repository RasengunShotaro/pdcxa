"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { useSignInFlow } from "@/lib/auth/use-sign-in";
import {
  type ResetPasswordFormSchema,
  resetPasswordFormSchema,
} from "../types";

export function ResetPasswordOtpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { signIn } = useSignInFlow();

  const form = useForm<ResetPasswordFormSchema>({
    resolver: standardSchemaResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormSchema) => {
    startTransition(async () => {
      const { error: verifyError } =
        await signIn.resetPasswordEmailCode.verifyCode({
          code: values.code,
        });

      if (verifyError) {
        toast.error("問題が発生しました", {
          description: "再度お試しください",
        });
        return;
      }

      const { error: submitError } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password: values.password,
        });

      if (submitError) {
        toast.error("問題が発生しました", {
          description: "再度お試しください",
        });
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
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>新しいパスワード</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
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
                <PasswordInput {...field} />
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
                <InputOTP maxLength={6} {...field}>
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
        <Button disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          パスワードをリセット
          <span className="sr-only">パスワードをリセット</span>
        </Button>
      </form>
    </Form>
  );
}
