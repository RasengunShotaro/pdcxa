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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type CheckEmailFormSchema, checkEmailFormSchema } from "../types";

export function ResetPasswordForm() {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();

  const form = useForm<CheckEmailFormSchema>({
    resolver: valibotResolver(checkEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: CheckEmailFormSchema) => {
    if (!isLoaded) return;

    try {
      const firstFactor = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: values.email,
      });

      if (firstFactor.status === "needs_first_factor") {
        router.push("/signin/reset-password/step2");
      }
    } catch {
      toast.error(
        "申し訳ありませんが、何か問題が発生しました。再度お試しください。"
      );
    }
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
        <Button>
          再設定メールを送信
          <span className="sr-only">
            パスワードのリセット確認を続けてください
          </span>
        </Button>
      </form>
    </Form>
  );
}
