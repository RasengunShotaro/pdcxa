"use client";

import { ChevronRight, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { type ReactNode, useId } from "react";
import { 選べる背景 } from "@/components/elements/app-backdrop/backdrop-registry";
import { GlassSheet, SheetGroup } from "@/components/elements/glass-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useSignOut } from "@/lib/auth/use-sign-out";
import { cn } from "@/lib/utils";
import { useAppearancePreferences } from "../hooks/use-appearance-preferences";
import {
  描く背景を決める,
  背景の選択肢,
} from "../utils/appearance-preferences";

const THEME_OPTIONS = [
  { value: "light", label: "ライト", icon: Sun },
  { value: "dark", label: "ダーク", icon: Moon },
  { value: "system", label: "システム", icon: Monitor },
] as const;

const SEGMENT_CLASS =
  "flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[7px] text-[0.8438rem] font-bold text-ink-2 transition-colors hover:text-ink has-checked:bg-segment-selected has-checked:text-ink has-checked:selected-pill has-focus-visible:ring-2 has-focus-visible:ring-ring/50";

interface SegmentsProps {
  legend: string;
  columns: 2 | 3;
  children: ReactNode;
}

function Segments({ legend, columns, children }: SegmentsProps) {
  return (
    <fieldset
      className={cn(
        "m-1.5 grid gap-0.5 rounded-[10px] bg-fill p-[3px]",
        columns === 2 ? "grid-cols-2" : "grid-cols-3",
      )}
    >
      <legend className="sr-only">{legend}</legend>
      {children}
    </fieldset>
  );
}

interface SettingsSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function SettingsSwitch({
  label,
  description,
  checked,
  onCheckedChange,
}: SettingsSwitchProps) {
  const labelId = useId();
  const descriptionId = useId();
  return (
    <div className="flex min-h-[52px] items-center gap-3 border-t border-line px-3.5 py-2 first:border-t-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[0.9375rem] leading-[1.4] text-ink" id={labelId}>
          {label}
        </span>
        <span
          className="text-[0.8125rem] leading-[1.4] text-ink-3"
          id={descriptionId}
        >
          {description}
        </span>
      </div>
      <button
        aria-checked={checked}
        aria-describedby={descriptionId}
        aria-labelledby={labelId}
        className={cn(
          "relative h-7 w-[46px] shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          checked ? "bg-brand" : "bg-fill-hover",
        )}
        onClick={() => onCheckedChange(!checked)}
        role="switch"
        type="button"
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-[3px] left-[3px] size-[22px] rounded-full bg-white shadow-sm transition-[translate]",
            checked && "translate-x-[18px]",
          )}
        />
      </button>
    </div>
  );
}

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenProfile: () => void;
}

export function SettingsSheet({
  open,
  onOpenChange,
  onOpenProfile,
}: SettingsSheetProps) {
  const { user } = useCurrentUser();
  const { signOut } = useSignOut();
  const { theme, setTheme } = useTheme();
  const { settings, update } = useAppearancePreferences();
  const backdrop = 描く背景を決める({
    backdrop: settings.backdrop,
    available: 選べる背景,
  });
  const displayName = user?.fullName ?? "ユーザー";

  return (
    <GlassSheet
      description="アカウントと表示を切り替える"
      onOpenChange={onOpenChange}
      open={open}
      title="設定"
    >
      <SheetGroup>
        <button
          className="flex min-h-[60px] w-full items-center gap-3 rounded-2xl px-3.5 py-2 text-left transition-colors hover:bg-fill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
          onClick={onOpenProfile}
          type="button"
        >
          <Avatar className="size-11">
            <AvatarImage alt="" src={user?.imageUrl} />
            <AvatarFallback className="bg-brand-soft text-sm font-bold text-ink">
              {avatarInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[0.9375rem] leading-[1.4] font-bold text-ink">
              {displayName}
            </span>
            <span className="truncate text-[0.8125rem] leading-[1.4] text-ink-3">
              プロフィール設定
            </span>
          </span>
          <ChevronRight aria-hidden="true" className="size-[19px] text-ink-2" />
        </button>
      </SheetGroup>

      <SheetGroup title="テーマ">
        <Segments columns={3} legend="テーマ">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <label className={SEGMENT_CLASS} key={value}>
              <input
                checked={theme === value}
                className="sr-only"
                name="theme"
                onChange={() => setTheme(value)}
                type="radio"
                value={value}
              />
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </label>
          ))}
        </Segments>
      </SheetGroup>

      <SheetGroup title="背景">
        <Segments columns={2} legend="背景">
          {背景の選択肢.map(({ value, label }) => (
            <label className={SEGMENT_CLASS} key={value}>
              <input
                checked={backdrop === value}
                className="sr-only"
                name="backdrop"
                onChange={() => update({ backdrop: value })}
                type="radio"
                value={value}
              />
              {label}
            </label>
          ))}
        </Segments>
      </SheetGroup>

      <SheetGroup title="質感と動き">
        <SettingsSwitch
          checked={settings.reduceTransparency}
          description="ガラスを不透明な面に置き換える"
          label="透明度を下げる"
          onCheckedChange={(checked) => update({ reduceTransparency: checked })}
        />
        <SettingsSwitch
          checked={settings.reduceMotion}
          description="画面の切り替えやガラスの動きを止める"
          label="視差効果を減らす"
          onCheckedChange={(checked) => update({ reduceMotion: checked })}
        />
      </SheetGroup>

      <SheetGroup>
        <button
          className="flex min-h-[52px] w-full items-center gap-3 rounded-2xl px-3.5 py-2 text-left text-[0.9375rem] text-danger transition-colors hover:bg-fill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
          onClick={() => signOut()}
          type="button"
        >
          <LogOut aria-hidden="true" className="size-[19px]" />
          ログアウト
        </button>
      </SheetGroup>
    </GlassSheet>
  );
}
