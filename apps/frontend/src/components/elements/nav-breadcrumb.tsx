"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbs } from "@/utils/generate-bread-crumbs";
import { NextLinkLoader } from "./next-link-loader";

export const NavBreadcrumb = () => {
  const pathName = usePathname();
  const breadcrumbPaths = generateBreadcrumbs(pathName);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbPaths.map((breadcrumb, index) => (
          <Fragment key={breadcrumb.href}>
            <BreadcrumbItem>
              {index < breadcrumbPaths.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link className="flex items-center" href={breadcrumb.href}>
                    {breadcrumb.label}
                    <NextLinkLoader className="size-4 ml-2" />
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbPaths.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
