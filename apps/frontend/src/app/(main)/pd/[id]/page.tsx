import { PdDetailView } from "@/feature/pd/components/detail/pd-detail-view";

interface PdDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PdDetailPage({ params }: PdDetailPageProps) {
  const { id } = await params;

  return <PdDetailView pdId={id} />;
}
