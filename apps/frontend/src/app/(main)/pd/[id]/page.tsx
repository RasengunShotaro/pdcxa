import { PdDetail } from "@/feature/pd/components/pd/pd-detail";

interface PdDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PdDetailPage({ params }: PdDetailProps) {
  const { id } = await params;

  return <PdDetail pdId={id} />;
}
