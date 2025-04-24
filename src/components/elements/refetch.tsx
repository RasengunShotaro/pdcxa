"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

type RefetchButtonProps = {
  onClick: () => void;
};

const RefetchButton = ({ onClick }: RefetchButtonProps) => {
  return (
    <Button variant="ghost" onClick={onClick}>
      <RefreshCcw className="h-4 w-4" />
    </Button>
  );
};

export const TimeLineRefetchButton = () => {
  const queryClient = useQueryClient();
  const refetchTimeLine = () => {
    queryClient.invalidateQueries({
      queryKey: ["PD詳細"],
    });
    queryClient.invalidateQueries({
      queryKey: ["ユーザー詳細情報"],
    });
    queryClient.invalidateQueries({
      queryKey: ["RePD詳細"],
    });
    toast.success("タイムラインを更新しました！");
  };

  return <RefetchButton onClick={refetchTimeLine} />;
};
