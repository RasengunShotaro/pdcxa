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
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

export function ProfileName() {
  const { user } = useUser();

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

  const onNameSubmit = async (value: NameFormSchema) => {
    try {
      await user?.update({
        firstName: value.firstName,
        lastName: value.lastName,
      });
      toast.success("名前を変更しました！");
    } catch (error) {
      form.setError("firstName", {
        message: `名前の変更に失敗しました。 ${error}`,
      });
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="flex flex-col mb-4">
        <h3 className="text-lg font-semibold">表示名</h3>
        <p className="text-sm font-normal text-muted-foreground">
          First Name、Last Nameは1文字以上入力してください。
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNameSubmit)} className="w-full">
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
          <div className="mb-2" />
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
        </form>
      </Form>
    </>
  );
}
