"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useTransition } from "react";

export const TimeLineRefetchButton = () => {
  const [isPending, startTransition] = useTransition();

  const queryClient = useQueryClient();
  const refetchTimeLine = () => {
    startTransition(() => {
      try {
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
      } catch {
        toast.error("タイムラインの更新に失敗しました。");
      }
    });
  };

  return (
    <Button variant="ghost" onClick={refetchTimeLine}>
      <RefreshCcw className={`${isPending ? "animate-spin" : ""}`} />
    </Button>
  );
};
