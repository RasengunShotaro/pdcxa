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

  const pdData = await fetchPds({ pdId: unwrapParams.id });
  const rePdData = await fetchRePds(unwrapParams.id);

  queryClient.setQueryData(["PD詳細", unwrapParams.id, null], pdData);
  queryClient.setQueryData(["RePD詳細", unwrapParams.id], rePdData);

  return (
    <Suspense fallback={<PdItemSkeleton PD数={1} />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PdDetail pdId={unwrapParams.id} />
      </HydrationBoundary>
    </Suspense>
  );
}
