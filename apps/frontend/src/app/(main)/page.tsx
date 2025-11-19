import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { fetchDetailedPds } from "@/feature/pd/api/pd/fetch-detailed-pds";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { PdTimeLine } from "@/feature/pd/components/pd/pd-timeline";

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["PD詳細", undefined, undefined],
    queryFn: () => fetchDetailedPds({}),
    initialPageParam: undefined as string | undefined,
  });

  return (
    <Suspense fallback={<PdItemSkeleton PD数={5} />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PdTimeLine />
      </HydrationBoundary>
    </Suspense>
  );
}
