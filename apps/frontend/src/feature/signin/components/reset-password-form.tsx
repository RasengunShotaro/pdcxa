"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, Send, TriangleAlert } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import type { SignInFlow } from "@/lib/auth/types";
import { useSignInFlow } from "@/lib/auth/use-sign-in";
import {
  type CheckEmailFormSchema,
  checkEmailFormSchema,
} from "../types/reset-form";

const RESET_FAILED = "問題が発生しました";
const RESET_FAILED_DETAIL = "再度お試しください";

interface ResetPasswordFormProps {
  flow?: SignInFlow;
}

export function ResetPasswordForm({ flow }: ResetPasswordFormProps) {
  const router = useRouter();
  const seam = useSignInFlow();
  const signIn = flow ?? seam.signIn;
  const [isPending, startTransition] = useTransition();
  const [hasError, setHasError] = useState(false);

  const form = useForm<CheckEmailFormSchema>({
    resolver: standardSchemaResolver(checkEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: CheckEmailFormSchema) => {
    setHasError(false);
    startTransition(async () => {
      const { error: createError } = await signIn.create({
        identifier: values.email,
      });

      if (createError) {
        setHasError(true);
        toast.error(RESET_FAILED, { description: RESET_FAILED_DETAIL });
        return;
      }

      const { error: sendCodeError } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendCodeError) {
        setHasError(true);
        toast.error(RESET_FAILED, { description: RESET_FAILED_DETAIL });
        return;
      }

      router.push("/signin/reset-password/step2");
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  inputMode="email"
                  placeholder="abcde@example.com"
                  type="email"
                  {...field}
                />
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
            <Send aria-hidden="true" className="size-4" />
          )}
          再設定メールを送信
        </Button>
      </form>
    </Form>
  );
}
