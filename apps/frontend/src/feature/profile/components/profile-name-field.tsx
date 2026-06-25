"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Check, Loader2 } from "lucide-react";
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
import { type NameFormSchema, nameFormSchema } from "../types/profile-name";

interface ProfileNameFieldProps {
  defaultValues: NameFormSchema;
  onSubmit: (value: NameFormSchema) => Promise<void>;
}

export function ProfileNameField({
  defaultValues,
  onSubmit,
}: ProfileNameFieldProps) {
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const form = useForm<NameFormSchema>({
    resolver: standardSchemaResolver(nameFormSchema),
    defaultValues,
  });

  const handleSubmit = async (value: NameFormSchema) => {
    setFeedback("idle");
    try {
      await onSubmit(value);
      setFeedback("success");
      toast.success("表示名を変更しました");
    } catch {
      setFeedback("error");
      toast.error("表示名の変更に失敗しました");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Taro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Yamada" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {feedback === "error" && (
          <Alert role="alert" variant="destructive">
            <AlertDescription>
              表示名の変更に失敗しました。時間をおいて再試行してください。
            </AlertDescription>
          </Alert>
        )}

        <p
          aria-live="polite"
          className="text-sm text-muted-foreground"
          role="status"
        >
          {feedback === "success" && "表示名を変更しました"}
        </p>

        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Check />
            )}
            保存する
          </Button>
        </div>
      </form>
    </Form>
  );
}
