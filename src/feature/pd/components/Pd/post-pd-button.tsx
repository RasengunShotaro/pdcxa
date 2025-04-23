import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { PdModal } from "./pd-modal";

export function PostPdButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full p-0 shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      <PdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
