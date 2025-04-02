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
import { Textarea } from "@/components/ui/textarea";
import { useRePd } from "@/hooks/useRePd";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

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
  const [content, setContent] = useState("");
  const { createRePd } = useRePd(pdId);

  const handleSubmit = () => {
    if (content.trim()) {
      createRePd(content);
      setContent("");
      onClose();
    }
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
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="RePDを入力してください..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={!content.trim()}>
            <MessageCircle className="h-3 w-3" />
            RePDする
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RePdModal;
