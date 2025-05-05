"use client";

import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import pdcxa from "../../../public/pdcxa.svg";
import { NavBreadcrumb } from "./nav-breadcrumb";

export const ResponsiveHeaderContent = () => {
  const { isMobile } = useSidebar();

  return isMobile ? (
    <Link href="/">
      <Image
        src={pdcxa}
        alt="Logo"
        className="h-7 w-auto dark:invert"
        quality={100}
      />
    </Link>
  ) : (
    <NavBreadcrumb />
  );
};
