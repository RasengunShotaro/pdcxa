"use client";

import { createContext, type ReactNode, use, useState } from "react";
import { InvitationSheet } from "@/feature/invitation/components/invitation-sheet";
import { PdComposer } from "@/feature/pd/components/composer/pd-composer";
import { ProfileSheet } from "@/feature/profile/components/profile-sheet";
import { SettingsSheet } from "@/feature/settings/components/settings-sheet";

export type AppSheetKind = "settings" | "profile" | "invitation";

interface AppSheetsValue {
  openSheet: (kind: AppSheetKind) => void;
  openComposer: () => void;
}

const AppSheetsContext = createContext<AppSheetsValue | null>(null);

export function useAppSheets(): AppSheetsValue {
  const value = use(AppSheetsContext);
  if (!value) {
    throw new Error("useAppSheets は AppSheetsProvider の中で使う");
  }
  return value;
}

interface AppSheetsProviderProps {
  children: ReactNode;
}

export function AppSheetsProvider({ children }: AppSheetsProviderProps) {
  const [openKind, setOpenKind] = useState<AppSheetKind | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const openSheet = (kind: AppSheetKind) => setOpenKind(kind);
  const openComposer = () => setIsComposerOpen(true);
  const closeUnless = (kind: AppSheetKind) => (open: boolean) =>
    setOpenKind((current) => (open ? kind : current === kind ? null : current));

  return (
    <AppSheetsContext value={{ openSheet, openComposer }}>
      {children}
      <PdComposer onOpenChange={setIsComposerOpen} open={isComposerOpen} />
      <SettingsSheet
        onOpenChange={closeUnless("settings")}
        onOpenProfile={() => openSheet("profile")}
        open={openKind === "settings"}
      />
      <ProfileSheet
        onOpenChange={closeUnless("profile")}
        open={openKind === "profile"}
      />
      <InvitationSheet
        onOpenChange={closeUnless("invitation")}
        open={openKind === "invitation"}
      />
    </AppSheetsContext>
  );
}
