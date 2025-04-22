"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import type { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ProfileImageProps = {
  user: ReturnType<typeof useUser>["user"];
};

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

export function ProfileImage({ user }: ProfileImageProps) {
  if (!user) return null;

  const form = useForm<ImageFormSchema>({
    resolver: zodResolver(imageFormSchema),
  });

  const onSubmit = async (data: ImageFormSchema) => {
    if (!user || !data.image[0]) return;
    try {
      await user.setProfileImage({ file: data.image[0] });
    } catch (error) {
      form.setError("image", {
        message: `画像のアップロードに失敗しました。 ${error}`,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <h4 className="text-lg font-semibold">プロフィール画像</h4>
        <p className="text-sm font-light text-muted-foreground">
          画像の比率が1:1でない場合、プレビューが実際と乖離します。
          <br />
          画像は10MB以下である必要があります。
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center p-6"
        >
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange } }) => (
              <FormControl>
                <label className="relative cursor-pointer group bg-transparent rounded-full">
                  <Avatar className="w-28 h-28">
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.fullName || "プロフィール"}
                    />
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium">画像を変更</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      onChange(e.target.files);
                      if (e.target.files?.[0]) {
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                  />
                </label>
              </FormControl>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={() => <FormMessage />}
          />
        </form>
      </Form>
    </>
  );
}
