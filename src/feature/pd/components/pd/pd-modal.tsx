"use client";

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
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Image, MessageCircle, X } from "lucide-react";
import NextImage from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type PdFormSchema, pdFormSchema } from "../../types";

interface PdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdModal: React.FC<PdModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<PdFormSchema>({
    resolver: valibotResolver(pdFormSchema),
    defaultValues: {
      content: "",
      image: undefined,
    },
  });
  const { createPd } = usePd({});

  const onSubmit = async (values: PdFormSchema) => {
    try {
      createPd({ content: values.content, image: values.image });
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規PD</DialogTitle>
          <DialogDescription>今の気持ちをPDしましょう</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            const url = URL.createObjectURL(file);
                            setPreviewUrl(url);
                          }
                        }}
                      />
                    </FormControl>
                    {previewUrl && (
                      <div className="relative w-fit mx-auto">
                        <div className="relative">
                          <NextImage
                            src={previewUrl}
                            alt="プレビュー"
                            className="rounded-md"
                            width={150}
                            height={150}
                            style={{
                              maxHeight: "150px",
                              width: "auto",
                              height: "auto",
                            }}
                          />
                          <div className="absolute top-1 right-1">
                            <Button
                              type="button"
                              variant="ghost"
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
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image />
                </Button>
              </div>
              <div>
                <Button type="submit">
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
