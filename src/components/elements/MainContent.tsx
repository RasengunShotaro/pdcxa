"use client";

import { usePd } from "@/hooks/usePd";
import { useState } from "react";
import PdItem from "../pd/PdItem";
import PdModal from "../pd/PdModal";
import { FloatingPdButton } from "./FloatingPdButton";

export function MainContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pds } = usePd();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4">
        {pds.map((post) => (
          <PdItem key={post.id} post={post} />
        ))}
      </div>

      <FloatingPdButton onClick={() => setIsModalOpen(true)} />

      <PdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
