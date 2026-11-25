"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useDefaultLayout } from "react-resizable-panels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { 一覧と詳細の幅の保存先 } from "./feed-layout-storage";
import { 画面の種類を決める } from "./nav-items";

const PANE_SCROLL_CLASS =
  "min-h-0 min-w-0 [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin] wide:overflow-y-auto wide:overscroll-contain";

const PANEL_CLASS = "flex min-h-0 min-w-0 flex-col max-wide:contents!";

interface FeedSurfaceProps {
  list: ReactNode;
  children: ReactNode;
}

export function FeedSurface({ list, children }: FeedSurfaceProps) {
  const pathname = usePathname();
  const view = 画面の種類を決める(pathname) === "detail" ? "detail" : "list";
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "pdcxa:feed-layout",
    panelIds: ["list", "detail"],
    storage: 一覧と詳細の幅の保存先,
  });

  return (
    <ResizablePanelGroup
      className="group/feed min-h-0 min-w-0 flex-1 max-wide:contents!"
      data-view={view}
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
      orientation="horizontal"
    >
      <ResizablePanel
        className={PANEL_CLASS}
        defaultSize="35%"
        id="list"
        maxSize="60%"
        minSize={280}
      >
        <section
          aria-label="タイムライン"
          className={`${PANE_SCROLL_CLASS} flex-1 py-2 max-wide:pb-28 max-wide:group-data-[view=detail]/feed:hidden`}
        >
          {list}
        </section>
      </ResizablePanel>
      <ResizableHandle
        aria-label="一覧と詳細の幅を変える"
        className="bg-line transition-colors after:w-3 hover:bg-brand/50 focus-visible:bg-brand max-wide:hidden"
      />
      <ResizablePanel className={PANEL_CLASS} id="detail" minSize={320}>
        <div
          className={`${PANE_SCROLL_CLASS} flex flex-1 flex-col px-6 pt-6 max-wide:min-h-[calc(100dvh-140px)] max-wide:px-4 max-wide:pt-4 max-wide:group-data-[view=list]/feed:hidden`}
        >
          {children}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

interface SinglePaneProps {
  children: ReactNode;
}

export function SinglePane({ children }: SinglePaneProps) {
  return (
    <div className={`${PANE_SCROLL_CLASS} flex-1 p-6 max-wide:p-4`}>
      <div className="max-wide:pb-28">{children}</div>
    </div>
  );
}

interface FeedSectionHeadingProps {
  children: ReactNode;
}

export function FeedSectionHeading({ children }: FeedSectionHeadingProps) {
  return (
    <h2 className="mt-[26px] flex items-baseline gap-2 text-[1rem] leading-normal font-bold text-ink">
      {children}
    </h2>
  );
}
