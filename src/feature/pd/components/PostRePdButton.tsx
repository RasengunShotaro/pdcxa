import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import RePdModal from "./RePdModal";

type PostRePdButtonProps = {
  pdId: string;
};

// PostPdButtonとほぼ一緒なので、あとでDRYするかも
export function PostRePdButton({ pdId }: PostRePdButtonProps) {
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
      <RePdModal
        pdId={pdId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
