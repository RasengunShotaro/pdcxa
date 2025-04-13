"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { SidebarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import pdcxa from "../../../static/pdcxa.svg";
import { NavBreadcrumb } from "./nav-breadcrumb";
import { TimeLineRefetchButton } from "./refetch";

export function SiteHeader() {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-1 h-4" />
        {isMobile ? (
          <>
            <Link href="/">
              <Image
                src={pdcxa}
                alt="Logo"
                className="h-7 w-auto"
                quality={100}
              />
            </Link>
          </>
        ) : (
          <NavBreadcrumb />
        )}
        <div className="ml-auto flex items-center">
          <TimeLineRefetchButton />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
