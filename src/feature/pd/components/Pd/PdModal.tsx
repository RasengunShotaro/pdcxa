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
import { usePd } from "@/hooks/usePd";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { type PdFormSchema, pdFormSchema } from "../../types";

interface PdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdModal: React.FC<PdModalProps> = ({ isOpen, onClose }) => {
  const form = useForm<PdFormSchema>({
    resolver: zodResolver(pdFormSchema),
    defaultValues: {
      pd: "",
    },
  });
  const { createPd } = usePd();

  const onSubmit = (values: PdFormSchema) => {
    createPd(values.pd);
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
                <MessageSquare className="h-3 w-3" />
                PDする
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
