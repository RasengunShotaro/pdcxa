"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInvitation } from "@/feature/invitation/create-invitation";
import {
  type InvitationFormSchema,
  invitationFormSchema,
} from "@/feature/invitation/types";

export const InvitationForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<InvitationFormSchema>({
    resolver: standardSchemaResolver(invitationFormSchema),
    defaultValues: {
      mail: "",
    },
  });

  const onSubmit = async (value: InvitationFormSchema) => {
    startTransition(async () => {
      try {
        form.reset();
        await createInvitation({ mail: value.mail });
        toast.success("招待を送信しました！");
      } catch (error) {
        form.setError("mail", {
          message: `招待の送信に失敗しました。 ${error}`,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="mail"
          render={({ field }) => (
            <div>
              <Label className="block text-sm font-medium mb-1" htmlFor="email">
                メールアドレス
              </Label>
              <FormControl>
                <Input id="email" {...field} placeholder="abcde@example.com" />
              </FormControl>
              <FormMessage />
            </div>
          )}
        />
        <Button className="w-full" disabled={isPending} type="submit">
          {isPending && <Loader2 className="animate-spin" />}
          PDCXAの世界に招待
        </Button>
      </form>
    </Form>
  );
};
