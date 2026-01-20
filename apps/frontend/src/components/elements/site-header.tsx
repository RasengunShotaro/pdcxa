import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { ColorModeSwitcher } from "./color-mode-switcher";
import { TimeLineRefetchButton } from "./refetch";
import { ResponsiveHeaderContent } from "./responsive-header-content";
import { ToggleSidebarButton } from "./toggle-sidebar-button";

export function SiteHeader() {
  return (
    <header className="site-header flex sticky top-0 z-50 w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <ToggleSidebarButton />
        <Separator className="mr-1 h-4!" orientation="vertical" />
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
