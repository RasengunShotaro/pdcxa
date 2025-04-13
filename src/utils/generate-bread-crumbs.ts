import { RouteMap } from "./route-map";

type RouteKey = keyof typeof RouteMap;

// このコードはひどい。負債になるので、後でリファクタリングしっかりしたい

export const generateBreadcrumbs = (path: string) => {
  const paths = path.split("/").filter((segment) => segment !== "");
  const breadcrumbs = [];

  let currentPath = "";
  breadcrumbs.push({ href: "/" as RouteKey, label: RouteMap["/"] });

  for (let i = 0; i < paths.length; i++) {
    const segment = paths[i];
    currentPath += `/${segment}`;

    if (segment === "pd" && i + 1 < paths.length) {
      const dynamicPath = "/pd/[id]" as RouteKey;
      currentPath += `/${paths[i + 1]}`;
      breadcrumbs.push({ href: currentPath, label: RouteMap[dynamicPath] });
      i++; // 次のセグメントは処理済みなのでスキップ
      continue;
    }

    const routePath = currentPath as RouteKey;
    const label = RouteMap[routePath] || segment;
    breadcrumbs.push({ href: currentPath, label });
  }

  return breadcrumbs;
};
