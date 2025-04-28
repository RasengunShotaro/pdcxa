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
import { usePd } from "@/hooks/use-pd";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type PdFormSchema, pdFormSchema } from "../../types";

interface PdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdModal: React.FC<PdModalProps> = ({ isOpen, onClose }) => {
  const form = useForm<PdFormSchema>({
    resolver: valibotResolver(pdFormSchema),
    defaultValues: {
      pd: "",
    },
  });
  const { createPd, error } = usePd({});

  const onSubmit = (values: PdFormSchema) => {
    createPd(values.pd);
    if (error) {
      toast.error("PDに失敗しました");
    } else {
      toast.success("PDしました!");
    }
    form.reset();
    onClose();
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
              name="pd"
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit">
                <MessageCircle className="h-3 w-3" />
                PDする
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
