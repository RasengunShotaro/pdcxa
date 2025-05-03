import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { fetchRePds } from "@/feature/pd/api/repd/fetch-repds";
import { PdDetail } from "@/feature/pd/components/pd/pd-detail";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PdDetail pdId={unwrapParams.id} />
    </HydrationBoundary>
  );
}
