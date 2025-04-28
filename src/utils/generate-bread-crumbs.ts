import { RouteMap } from "./route-map";

type RouteKey = keyof typeof RouteMap;
type Breadcrumb = { href: string; label: string };

// このコードはひどい。負債になるので、後でリファクタリングしっかりしたい
export const generateBreadcrumbs = (path: string): Breadcrumb[] => {
  const segments = path.split("/").filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];

  // ルートパスを追加
  breadcrumbs.push({ href: "/", label: RouteMap["/"] });

  if (segments.length === 0) {
    return breadcrumbs;
  }

  let currentPath = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    if (segment === "pd" && i + 1 < segments.length) {
      const nextSegment = segments[i + 1];
      const dynamicRoutePath = "/pd/[id]";
      const fullPath = `/${segment}/${nextSegment}`;

      breadcrumbs.push({
        href: fullPath,
        label: RouteMap[dynamicRoutePath],
      });

      i++; // 次のセグメントは処理済み
      currentPath = fullPath;
      continue;
    }

    const routeKey = currentPath as RouteKey;
    const label = RouteMap[routeKey] || segment;

    breadcrumbs.push({
      href: currentPath,
      label,
    });
  }

  return breadcrumbs;
};
