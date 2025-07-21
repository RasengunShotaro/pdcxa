"use client";

import { SidebarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export const ToggleSidebarButton = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      className="h-8 w-8"
      onClick={toggleSidebar}
      size="icon"
      variant="ghost"
    >
      <SidebarIcon />
    </Button>
  );
};
