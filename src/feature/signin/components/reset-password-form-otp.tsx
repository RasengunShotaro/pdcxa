"use client";

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
import { useSignIn } from "@clerk/nextjs";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type ResetPasswordFormSchema,
  resetPasswordFormSchema,
} from "../types";

export function ResetPasswordOtpForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { isLoaded, signIn, setActive } = useSignIn();

  const form = useForm<ResetPasswordFormSchema>({
    resolver: valibotResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormSchema) => {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const attemptFirstFactor = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: values.code,
          password: values.password,
        });

        if (attemptFirstFactor.status === "complete") {
          await setActive({
            session: attemptFirstFactor.createdSessionId,
          });
          router.push(`${window.location.origin}/`);
          toast.success("パスワードが正常にリセットされました。");
        }
      } catch {
        toast.error("問題が発生しました", {
          description: "再度お試しください",
        });
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
          {isPending && <Loader className="animate-spin" />}
          パスワードをリセット
          <span className="sr-only">パスワードをリセット</span>
        </Button>
      </form>
    </Form>
  );
}
