import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PdItemSkeleton = ({ PD数 }: { PD数: number }) => {
  return (
    <div className="flex-auto max-w-2xl">
      <div className="space-y-4">
        {Array.from({ length: PD数 }, (_, i) => i).map((要素) => (
          <div key={`skeleton-${要素}`}>
            <Card className="border-b">
              <CardHeader className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      <Skeleton className="h-8 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
