"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Layout, LayoutChangedMeta } from "react-resizable-panels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  type 一覧と詳細の幅,
  一覧と詳細の幅を保存する形にする,
} from "./feed-layout-cookie";
import { 画面の種類を決める } from "./nav-items";

const 一覧と詳細の幅を覚える = (layout: Layout, meta: LayoutChangedMeta) => {
  const { list, detail } = meta.requestedLayout ?? layout;
  if (list === undefined || detail === undefined) {
    return;
  }
  window.cookieStore
    ?.set(
      一覧と詳細の幅を保存する形にする({
        layout: { list, detail },
        now: Date.now(),
      }),
    )
    .catch(() => undefined);
};

const PANE_SCROLL_CLASS =
  "min-h-0 min-w-0 [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin] wide:overflow-y-auto wide:overscroll-contain";

const PANEL_CLASS = "flex min-h-0 min-w-0 flex-col max-wide:contents!";

interface FeedSurfaceProps {
  list: ReactNode;
  children: ReactNode;
  savedLayout?: 一覧と詳細の幅;
}

export function FeedSurface({ list, children, savedLayout }: FeedSurfaceProps) {
  const pathname = usePathname();
  const view = 画面の種類を決める(pathname) === "detail" ? "detail" : "list";

  return (
    <ResizablePanelGroup
      className="group/feed min-h-0 min-w-0 flex-1 max-wide:contents!"
      data-view={view}
      defaultLayout={savedLayout ? { ...savedLayout } : undefined}
      onLayoutChanged={一覧と詳細の幅を覚える}
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
