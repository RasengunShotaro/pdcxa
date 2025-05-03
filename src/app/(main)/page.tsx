import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { PdTimeLine } from "@/feature/pd/components/pd/pd-timeline";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
export const runtime = "edge";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["PD詳細", null, null],
    queryFn: () => fetchPds({}),
  });

  return (
    <Suspense fallback={<PdItemSkeleton PD数={5} />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PdTimeLine />
      </HydrationBoundary>
    </Suspense>
  );
}
