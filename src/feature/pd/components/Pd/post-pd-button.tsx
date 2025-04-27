import { Button } from "@/components/ui/button";
import { useSwipe } from "@/hooks/use-swipe";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { PdModal } from "./pd-modal";

export function PostPdButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useSwipe(setIsVisible);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full p-0 shadow-lg transition-all duration-300 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
        size="icon"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      <PdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
