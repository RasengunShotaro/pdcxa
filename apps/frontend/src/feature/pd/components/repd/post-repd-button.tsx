import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSwipe } from "@/hooks/use-swipe";
import { RePdModal } from "./repd-modal";

type PostRePdButtonProps = {
  pdId: string;
};

// PostPdButtonとほぼ一緒なので、あとでDRYするかも
export function PostRePdButton({ pdId }: PostRePdButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useSwipe(setIsVisible);

  return (
    <>
      <Button
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full p-0 shadow-lg transition-all duration-300 group ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsModalOpen(true)}
        size="icon"
      >
        <MessageCircle className="h-4 w-4 transition-transform duration-100 group-hover:scale-125" />
      </Button>
      <RePdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdId={pdId}
      />
    </>
  );
}
