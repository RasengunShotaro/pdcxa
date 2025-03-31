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
import { usePd } from "@/hooks/usePd";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

interface PdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdModal: React.FC<PdModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState("");
  const { createPd } = usePd();

  const handleSubmit = () => {
    if (content.trim()) {
      createPd(content);
      setContent("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新規PD</DialogTitle>
          <DialogDescription>今の気持ちをPDしましょう</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="PDを入力してください..."
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
            <MessageSquare className="h-3 w-3" />
            PDする
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PdModal;
