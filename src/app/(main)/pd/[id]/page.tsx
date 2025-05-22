import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { fetchRePds } from "@/feature/pd/api/repd/fetch-repds";
import { PdDetail } from "@/feature/pd/components/pd/pd-detail";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
export const runtime = "edge";

interface PdDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PdDetailPage({ params }: PdDetailProps) {
  const unwrapParams = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["PD詳細", unwrapParams.id, null],
    queryFn: () => fetchPds({ pdId: unwrapParams.id, cursor: "" }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["RePD詳細", unwrapParams.id],
    queryFn: () => fetchRePds(unwrapParams.id),
  });

  return (
    <Suspense fallback={<PdItemSkeleton PD数={1} />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PdDetail pdId={unwrapParams.id} />
      </HydrationBoundary>
    </Suspense>
  );
}
