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
import { Input } from "@/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type CheckEmailFormSchema, checkEmailFormSchema } from "../types";

export function ResetPasswordForm() {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CheckEmailFormSchema>({
    resolver: valibotResolver(checkEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: CheckEmailFormSchema) => {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const firstFactor = await signIn.create({
          strategy: "reset_password_email_code",
          identifier: values.email,
        });

        if (firstFactor.status === "needs_first_factor") {
          router.push("/signin/reset-password/step2");
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
        <Button disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          再設定メールを送信
          <span className="sr-only">
            パスワードのリセット確認を続けてください
          </span>
        </Button>
      </form>
    </Form>
  );
}
