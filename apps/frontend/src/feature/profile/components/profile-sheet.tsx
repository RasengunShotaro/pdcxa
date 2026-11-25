"use client";

import { GlassSheet } from "@/components/elements/glass-sheet";
import { ProfileEditor } from "./profile-view";

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  return (
    <GlassSheet
      description="プロフィール画像・表示名・ID を変える"
      onOpenChange={onOpenChange}
      open={open}
      title="プロフィール設定"
    >
      <div className="rounded-2xl bg-sheet-group p-5">
        <ProfileEditor />
      </div>
    </GlassSheet>
  );
}
