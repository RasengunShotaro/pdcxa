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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const invitationFormSchema = z.object({
  mail: z.string().email({
    message: "メールアドレスの形式が正しくありません",
  }),
});

type InvitationFormSchema = z.infer<typeof invitationFormSchema>;

export default function Page() {
  const form = useForm<InvitationFormSchema>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      mail: "",
    },
  });

  const onSubmit = async (value: InvitationFormSchema) => {
    form.reset();
    await createInvitation(value.mail);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>招待を送信</CardTitle>
        </CardHeader>
        <CardContent>
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
