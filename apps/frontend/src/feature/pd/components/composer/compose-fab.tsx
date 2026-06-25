"use client";

import { MessageCirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComposeFabProps {
  onClick: () => void;
}

export function ComposeFab({ onClick }: ComposeFabProps) {
  return (
    <Button
      aria-label="PDする"
      className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-30 size-14 rounded-full shadow-md [&_svg]:size-6"
      onClick={onClick}
      size="icon"
      type="button"
    >
      <MessageCirclePlus aria-hidden="true" />
    </Button>
  );
}
