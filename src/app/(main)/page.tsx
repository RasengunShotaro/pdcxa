import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { PdTimeLine } from "@/feature/pd/components/pd/pd-timeline";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
export const runtime = "edge";

export default async function Page() {
  const queryClient = new QueryClient();

  const pdData = await fetchPds({});

  queryClient.setQueryData(["PD詳細", null, null], pdData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PdTimeLine />
    </HydrationBoundary>
  );
}
