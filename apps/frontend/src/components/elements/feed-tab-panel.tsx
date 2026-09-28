import { type ReactNode, ViewTransition } from "react";

interface FeedTabPanelProps {
  children: ReactNode;
}

const TAB_SLIDES = {
  "tab-forward": "tab-forward",
  "tab-back": "tab-back",
  default: "none",
};

export function FeedTabPanel({ children }: FeedTabPanelProps) {
  return (
    <ViewTransition default="none" enter={TAB_SLIDES} exit={TAB_SLIDES}>
      <div>{children}</div>
    </ViewTransition>
  );
}
