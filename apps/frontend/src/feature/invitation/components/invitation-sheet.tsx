"use client";

import { GlassSheet } from "@/components/elements/glass-sheet";
import { InvitationForm } from "./invitation-form";

interface InvitationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvitationSheet({ open, onOpenChange }: InvitationSheetProps) {
  return (
    <GlassSheet
      description="入力したアドレス宛に登録リンクを送る"
      onOpenChange={onOpenChange}
      open={open}
      title="PDCXAに招待する"
    >
      <div className="flex flex-col gap-4 rounded-2xl bg-sheet-group p-5">
        <p className="text-[0.875rem] leading-[1.7] text-ink-3">
          入力したアドレス宛に登録リンクを送ります。
          <br />
          迷惑メールに振り分けられることがあります。
        </p>
        <InvitationForm />
      </div>
    </GlassSheet>
  );
}
