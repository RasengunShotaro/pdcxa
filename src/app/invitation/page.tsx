"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
  const form = useForm<InvitationFormSchema>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      mail: "",
    },
  });

  const onSubmit = async (value: InvitationFormSchema) => {
    try {
      form.reset();
      await createInvitation({ mail: value.mail });
      toast.success("招待を送信しました！");
    } catch (error) {
      form.setError("mail", {
        message: `招待の送信に失敗しました。 ${error}`,
      });
    }
  };

  return (
    <div className="flex-auto max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>招待を送信</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="mail"
                render={({ field }) => (
                  <div>
                    <Label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      メールアドレス
                    </Label>
                    <FormControl>
                      <Input
                        id="email"
                        {...field}
                        placeholder="abcde@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />
              <Button type="submit" className="w-full">
                PDCXAの世界に招待
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
