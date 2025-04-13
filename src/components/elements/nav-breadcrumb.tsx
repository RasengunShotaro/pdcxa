"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbs } from "@/utils/generate-bread-crumbs";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

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
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
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
