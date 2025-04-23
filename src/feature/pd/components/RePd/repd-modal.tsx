"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
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
    resolver: zodResolver(pdFormSchema),
    defaultValues: {
      pd: "",
    },
  });
  const { createRePd } = useRePd(pdId);

  const onSubmit = (values: PdFormSchema) => {
    createRePd(values.pd);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>RePD</DialogTitle>
          <DialogDescription>
            自分が感じたことを伝えてみましょう
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="pd"
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
              <Button type="button" variant="outline" onClick={onClose}>
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
