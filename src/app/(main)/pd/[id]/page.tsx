import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { fetchDetailedPds } from "@/feature/pd/api/pd/fetch-detailed-pds";
import { fetchDetailedRepds } from "@/feature/pd/api/repd/fetch-detailed-repds";
import { PdDetail } from "@/feature/pd/components/pd/pd-detail";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";

interface PdDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PdDetailPage({ params }: PdDetailProps) {
  const unwrapParams = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["PD詳細", unwrapParams.id, null],
    queryFn: () => fetchDetailedPds({ pdId: unwrapParams.id }),
    initialPageParam: undefined as string | undefined,
  });

  await queryClient.prefetchQuery({
    queryKey: ["RePD詳細", unwrapParams.id],
    queryFn: () => fetchDetailedRepds(unwrapParams.id),
  });

  return (
    <Suspense fallback={<PdItemSkeleton PD数={1} />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PdDetail pdId={unwrapParams.id} />
      </HydrationBoundary>
    </Suspense>
  );
}
