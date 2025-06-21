"use client";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRePd } from "@/hooks/use-repd";
import { type PdFormSchema, pdFormSchema } from "../../types";

interface RePdModalProps {
  pdId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RePdModal: React.FC<RePdModalProps> = ({
  pdId,
  isOpen,
  onClose,
}) => {
  const form = useForm<PdFormSchema>({
    resolver: valibotResolver(pdFormSchema),
    defaultValues: {
      content: "",
    },
  });
  const { createRePd, error } = useRePd(pdId);

  const onSubmit = (values: PdFormSchema) => {
    createRePd(values.content);
    if (error) {
      toast.error("RePDに失敗しました");
    } else {
      toast.success("RePDしました!");
    }
    form.reset();
    onClose();
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>RePD</DialogTitle>
          <DialogDescription>
            自分が感じたことを伝えてみましょう
          </DialogDescription>
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
                      placeholder="RePDを入力してください..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <DialogFooter>
              <Button onClick={onClose} type="button" variant="outline">
                キャンセル
              </Button>
              <Button type="submit">
                <MessageCircle className="h-3 w-3" />
                RePDする
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
