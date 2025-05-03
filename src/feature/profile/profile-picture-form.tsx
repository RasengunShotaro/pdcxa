"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ImageFormSchema, imageFormSchema } from "./types";

export function ProfilePictureForm() {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const imageForm = useForm<ImageFormSchema>({
    resolver: valibotResolver(imageFormSchema),
  });

  const onSubmit = async (data: ImageFormSchema) => {
    if (!user || !data.image) return;

    startTransition(async () => {
      try {
        await user.setProfileImage({ file: data.image });
        toast.success("画像を変更しました！");
      } catch (error) {
        imageForm.setError("image", {
          message: `画像のアップロードに失敗しました。 ${error}`,
        });
      }
    });
  };

  if (!user) return null;

  return (
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
              <label
                className={`relative ${
                  isPending ? "cursor-not-allowed" : "cursor-pointer"
                } group bg-transparent rounded-full`}
              >
                <Avatar className="w-64 h-64">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName || "プロフィール"}
                  />
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium">
                    {isPending ? "画像を変更中..." : "画像を変更"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isPending}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    onChange(file);
                    if (file) {
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
  );
}
