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
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Loader } from "lucide-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
      } catch (error) {
        form.setError("firstName", {
          message: `名前の変更に失敗しました。 ${error}`,
        });
      }
    });
  };

  if (!user) return null;

  return (
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
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader className="animate-spin" />}
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
