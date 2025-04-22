"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const nameFormSchema = z.object({
  firstName: z.string().min(1, {
    message: "FirstNameを1文字以上入力してください",
  }),
  lastName: z.string().min(1, {
    message: "LastNameを1文字以上入力してください",
  }),
});

type NameFormSchema = z.infer<typeof nameFormSchema>;

type NameFormProps = {
  user: ReturnType<typeof useUser>["user"];
};

export function NameForm({ user }: NameFormProps) {
  const [success, setSuccess] = useState(false);

  const form = useForm<NameFormSchema>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user, form]);

  if (!user) return null;

  const onNameSubmit = async (value: NameFormSchema) => {
    try {
      await user.update({
        firstName: value.firstName,
        lastName: value.lastName,
      });
      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      form.setError("firstName", {
        message: `名前の変更に失敗しました。 ${error}`,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold">表示名</h4>
        <p className="text-sm font-light text-muted-foreground">
          First Name、Last Nameは1文字以上入力してください。
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNameSubmit)}>
          <div className="flex flex-auto gap-4 items-end">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
                  </Label>
                  <FormControl>
                    <Input
                      id="firstName"
                      {...field}
                      placeholder={field.value}
                    />
                  </FormControl>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <div>
                  <Label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name
                  </Label>
                  <FormControl>
                    <Input id="lastName" {...field} placeholder={field.value} />
                  </FormControl>
                </div>
              )}
            />
            <Button type="submit">変更</Button>
          </div>
          <FormField
            control={form.control}
            name="firstName"
            render={() => <FormMessage />}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={() => <FormMessage />}
          />
          <FormMessage>{success && "名前を変更しました！"}</FormMessage>
        </form>
      </Form>
    </>
  );
}
