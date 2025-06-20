"use client";

import { useUser } from "@clerk/nextjs";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Loader2 } from "lucide-react";
import { useEffect, useTransition } from "react";
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
import { type NameFormSchema, nameFormSchema } from "./types";
export function ProfileNameForm() {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const form = useForm<NameFormSchema>({
    resolver: valibotResolver(nameFormSchema),
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
    startTransition(async () => {
      try {
        await user?.update({
          firstName: value.firstName,
          lastName: value.lastName,
        });
        toast.success("名前を変更しました！");
      } catch {
        form.setError("firstName", {
          message: "名前の変更に失敗しました。",
        });
      }
    });
  };

  if (!user) return null;

  return (
    <Form {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onNameSubmit)}>
        <div className="flex flex-auto gap-4 items-end">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <div>
                <Label
                  className="block text-sm font-medium mb-1"
                  htmlFor="firstName"
                >
                  First Name
                </Label>
                <FormControl>
                  <Input id="firstName" {...field} placeholder={field.value} />
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
                  className="block text-sm font-medium mb-1"
                  htmlFor="lastName"
                >
                  Last Name
                </Label>
                <FormControl>
                  <Input id="lastName" {...field} placeholder={field.value} />
                </FormControl>
              </div>
            )}
          />
          <Button disabled={isPending} type="submit">
            {isPending && <Loader2 className="animate-spin" />}
            変更
          </Button>
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
  );
}
