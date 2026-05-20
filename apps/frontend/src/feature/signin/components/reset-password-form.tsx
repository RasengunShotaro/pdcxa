"use client";

import { useSignIn } from "@clerk/nextjs";
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
import { Input } from "@/components/ui/input";
import { type CheckEmailFormSchema, checkEmailFormSchema } from "../types";

export function ResetPasswordForm() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CheckEmailFormSchema>({
    resolver: standardSchemaResolver(checkEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: CheckEmailFormSchema) => {
    startTransition(async () => {
      const { error: createError } = await signIn.create({
        identifier: values.email,
      });

      if (createError) {
        toast.error("問題が発生しました", {
          description: "再度お試しください",
        });
        return;
      }

      const { error: sendCodeError } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendCodeError) {
        toast.error("問題が発生しました", {
          description: "再度お試しください",
        });
        return;
      }

      router.push("/signin/reset-password/step2");
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
