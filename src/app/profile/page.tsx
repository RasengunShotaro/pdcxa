"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {} from "@/components/ui/form";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const imageFormSchema = z.object({
  image: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, {
      message: "画像を選択してください",
    })
    .refine(
      (files) => {
        const file = files?.[0];
        return file?.type?.startsWith("image/");
      },
      {
        message: "画像ファイルを選択してください",
      }
    )
    .refine(
      (files) => {
        const file = files?.[0];
        return file?.size <= MAX_FILE_SIZE;
      },
      {
        message: "ファイルサイズは10MB以下にしてください",
      }
    ),
});

type ImageFormSchema = z.infer<typeof imageFormSchema>;
const nameFormSchema = z.object({
  firstName: z.string().min(1, {
    message: "FirstNameを1文字以上入力してください",
  }),
  lastName: z.string().min(1, {
    message: "LastNameを1文字以上入力してください",
  }),
});

type NameFormSchema = z.infer<typeof nameFormSchema>;

export default function Page() {
  const { user } = useUser();
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

  const onNameSubmit = async (value: NameFormSchema) => {
    try {
      await user?.update({
        firstName: value.firstName,
        lastName: value.lastName,
      });
      setSuccess(true);
      toast.success("名前を変更しました！");
    } catch (error) {
      setSuccess(false);
      form.setError("firstName", {
        message: `名前の変更に失敗しました。 ${error}`,
      });
    }
  };

  const imageForm = useForm<ImageFormSchema>({
    resolver: zodResolver(imageFormSchema),
  });

  const onSubmit = async (data: ImageFormSchema) => {
    if (!user || !data.image[0]) return;
    try {
      await user.setProfileImage({ file: data.image[0] });
      toast.success("画像を変更しました！");
    } catch (error) {
      imageForm.setError("image", {
        message: `画像のアップロードに失敗しました。 ${error}`,
      });
    }
  };

  if (!user) return null;

  return (
    <div className="w-fit flex-auto max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">プロフィール設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col mt-4 border-t pt-4 mb-4">
            <h3 className="text-lg font-semibold">プロフィール画像</h3>
            <p className="text-sm font-normal text-muted-foreground">
              画像の比率が1:1でない場合、プレビューが実際と乖離します。
              <br />
              画像は10MB以下である必要があります。
            </p>
          </div>
          <Form {...imageForm}>
            <form
              onSubmit={imageForm.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center p-6"
            >
              <FormField
                control={imageForm.control}
                name="image"
                render={({ field: { onChange } }) => (
                  <FormControl>
                    <label className="relative cursor-pointer group bg-transparent rounded-full">
                      <Avatar className="w-64 h-64">
                        <AvatarImage
                          src={user.imageUrl}
                          alt={user.fullName || "プロフィール"}
                        />
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">
                          画像を変更
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          onChange(e.target.files);
                          if (e.target.files?.[0]) {
                            imageForm.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </label>
                  </FormControl>
                )}
              />
              <FormField
                control={imageForm.control}
                name="image"
                render={() => <FormMessage />}
              />
            </form>
          </Form>
          <div className="flex flex-col mt-4 border-t pt-4 mb-4">
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
                        <Input
                          id="lastName"
                          {...field}
                          placeholder={field.value}
                        />
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
        </CardContent>
      </Card>
    </div>
  );
}
