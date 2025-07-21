"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Image, Loader2, MessageCircle, X } from "lucide-react";
import NextImage from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePd } from "@/hooks/use-pd";
import { type PdFormSchema, pdFormSchema } from "../../types";
import { resizeImage } from "../../utils/resize-image";

interface PdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdModal: React.FC<PdModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<PdFormSchema>({
    resolver: standardSchemaResolver(pdFormSchema),
    defaultValues: {
      content: "",
      image: undefined,
    },
  });
  const { createPd, isMutationPending } = usePd({});

  const onSubmit = async (values: PdFormSchema) => {
    try {
      const image = values.image ? await resizeImage(values.image) : undefined;
      await createPd({ content: values.content, image });
      toast.success("PDしました!");

      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setPreviewUrl(null);
      onClose();
    } catch {
      toast.error("PDに失敗しました");
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規PD</DialogTitle>
          <DialogDescription>今の気持ちをPDしましょう</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <div className="grid gap-4 py-4">
                  <FormControl>
                    <Textarea
                      placeholder="PDを入力してください..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange } }) => {
                return (
                  <>
                    <FormControl>
                      <Input
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            const url = URL.createObjectURL(file);
                            setPreviewUrl(url);
                          }
                        }}
                        ref={fileInputRef}
                        type="file"
                      />
                    </FormControl>
                    {previewUrl && (
                      <div className="relative w-fit mx-auto">
                        <div className="relative">
                          <NextImage
                            alt="プレビュー"
                            className="rounded-md"
                            height={150}
                            src={previewUrl}
                            style={{
                              maxHeight: "150px",
                              width: "auto",
                              height: "auto",
                            }}
                            width={150}
                          />
                          <div className="absolute top-1 right-1">
                            <Button
                              className="h-6 w-6 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                              onClick={() => {
                                onChange(undefined);
                                if (previewUrl) {
                                  URL.revokeObjectURL(previewUrl);
                                  setPreviewUrl(null);
                                }
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                              type="button"
                              variant="ghost"
                            >
                              <X />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </>
                );
              }}
            />
            <div className="flex justify-between items-center w-full mt-4">
              <div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  variant="outline"
                >
                  <Image />
                </Button>
              </div>
              <div>
                <Button type="submit">
                  {isMutationPending && <Loader2 className="animate-spin" />}
                  <MessageCircle className="h-3 w-3 mr-1" />
                  PDする
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
