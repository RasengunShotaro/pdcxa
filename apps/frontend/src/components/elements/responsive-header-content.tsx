"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { NavBreadcrumb } from "./nav-breadcrumb";

export const ResponsiveHeaderContent = () => {
  const { isMobile } = useSidebar();

  return isMobile ? (
    <Link href="/">
      <Image
        alt="Logo"
        className="h-7 w-auto dark:invert"
        height={40}
        quality={100}
        src="/pdcxa.svg"
        width={140}
      />
    </Link>
  ) : (
    <NavBreadcrumb />
  );
};
