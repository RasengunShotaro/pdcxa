"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
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

export function ProfilePicture() {
  const { user } = useUser();

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
    <>
      <div className="flex flex-col mb-4">
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
                    <span className="text-white font-medium">画像を変更</span>
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
    </>
  );
}
