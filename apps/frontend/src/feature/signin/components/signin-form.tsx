"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2, LogIn, TriangleAlert } from "lucide-react";
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
import { PasswordInput } from "@/components/ui/password-input";
import type { SignInFlow } from "@/lib/auth/types";
import { useSignInFlow } from "@/lib/auth/use-sign-in";
import { アプリへ入る演出を始める } from "../transition/enter-app-transition";
import { type SigninFormSchema, signinFormSchema } from "../types/signin-form";
import {
  LOGIN_ALERT_CLASS,
  LOGIN_FIELD_CLASS,
  LOGIN_LABEL_CLASS,
  LOGIN_SUBMIT_CLASS,
} from "./login-scene/login-field";

const SIGN_IN_FAILED = "ログインに失敗しました";
const SIGN_IN_FAILED_DETAIL =
  "メールアドレスまたはパスワードが正しいか確認してください";

interface SignInFormProps {
  flow?: SignInFlow;
}

export function SignInForm({ flow }: SignInFormProps) {
  const seam = useSignInFlow();
  const signIn = flow ?? seam.signIn;
  const [isPending, startTransition] = useTransition();
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  const form = useForm<SigninFormSchema>({
    resolver: standardSchemaResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: SigninFormSchema) => {
    setHasError(false);
    startTransition(async () => {
      const { error } = await signIn.password({
        emailAddress: values.email,
        password: values.password,
      });

      if (error) {
        setHasError(true);
        toast.error(SIGN_IN_FAILED, { description: SIGN_IN_FAILED_DETAIL });
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/");
            アプリへ入る演出を始める();
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.push(url);
            }
          },
        });
        toast.success("ログインしました!");
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={LOGIN_LABEL_CLASS}>
                メールアドレス
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  className={LOGIN_FIELD_CLASS}
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={LOGIN_LABEL_CLASS}>パスワード</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="current-password"
                  className={LOGIN_FIELD_CLASS}
                  placeholder="8文字以上のパスワード"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasError ? (
          <Alert className={LOGIN_ALERT_CLASS} variant="destructive">
            <TriangleAlert />
            <AlertDescription>{SIGN_IN_FAILED_DETAIL}</AlertDescription>
          </Alert>
        ) : null}

        <Button
          className={LOGIN_SUBMIT_CLASS}
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <LogIn aria-hidden="true" className="size-4" />
          )}
          ログイン
        </Button>
      </form>
    </Form>
  );
}
