import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { ColorModeSwitcher } from "./color-mode-switcher";
import { TimeLineRefetchButton } from "./refetch";
import { ResponsiveHeaderContent } from "./responsive-header-content";
import { ToggleSidebarButton } from "./toggle-sidebar-button";

export function SiteHeader() {
  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <ToggleSidebarButton />
        <Separator orientation="vertical" className="mr-1 !h-4" />
        <ResponsiveHeaderContent />
        <div className="ml-auto flex items-center">
          <TimeLineRefetchButton />
          <ColorModeSwitcher />
          <div className="mx-1" />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
