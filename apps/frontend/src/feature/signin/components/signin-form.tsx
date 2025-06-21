"use client";

import { useSignIn } from "@clerk/nextjs";
import { valibotResolver } from "@hookform/resolvers/valibot";
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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  type SigninFormSchema,
  signinFormSchema,
} from "@/feature/signin/types";

export function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SigninFormSchema>({
    resolver: valibotResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SigninFormSchema) => {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const result = await signIn.create({
          identifier: values.email,
          password: values.password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          toast.success("ログインしました!");
          router.push(`${window.location.origin}/`);
        }
      } catch {
        toast.error("ログインに失敗しました", {
          description: "メールアドレスまたはパスワードが正しいか確認して下さい",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="abcde@example.com" {...field} />
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
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <PasswordInput placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          ログイン
          <span className="sr-only">ログイン</span>
        </Button>
      </form>
    </Form>
  );
}
