"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

type Props = {
  onClick: () => void;
};

export function FloatingPdButton({ onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full p-0 shadow-lg"
      size="icon"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
}
