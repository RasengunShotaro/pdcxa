"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";
import { useState } from "react";
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
import { useCreateInvitation } from "@/feature/invitation/hooks/use-create-invitation";
import {
  type InvitationFormSchema,
  invitationFormSchema,
} from "@/feature/invitation/types/invitation-form";
import { errorDisplay } from "@/lib/error-message";

export const InvitationForm = () => {
  const { createInvitation, isPending } = useCreateInvitation();
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<InvitationFormSchema>({
    resolver: standardSchemaResolver(invitationFormSchema),
    defaultValues: { mail: "" },
  });

  const onSubmit = async (values: InvitationFormSchema) => {
    setSubmitError(null);
    setSentTo(null);
    try {
      await createInvitation({ mail: values.mail });
      setSentTo(values.mail);
      form.reset({ mail: "" });
      toast.success("招待を送信しました");
    } catch (error) {
      setSubmitError(error);
      toast.error(errorDisplay(error).message);
    }
  };

  return (
    <Form {...form}>
      <form
        aria-busy={isPending}
        className="space-y-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="mail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  inputMode="email"
                  placeholder="invite@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {sentTo ? (
          <Alert role="status" variant="default">
            <CheckCircle2 />
            <AlertDescription>{sentTo} に招待を送信しました。</AlertDescription>
          </Alert>
        ) : null}

        {submitError ? (
          <Alert
            variant={
              errorDisplay(submitError).kind === "retryable"
                ? "default"
                : "destructive"
            }
          >
            <TriangleAlert />
            <AlertDescription>
              {errorDisplay(submitError).message}
            </AlertDescription>
          </Alert>
        ) : null}

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Send aria-hidden="true" className="size-4" />
          )}
          PDCXAの世界に招待
        </Button>
      </form>
    </Form>
  );
};
