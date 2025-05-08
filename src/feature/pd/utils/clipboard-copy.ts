import { toast } from "sonner";

export const handleCopy = (text: string) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("クリップボードに保存しました");
    } catch {
      toast.error("クリップボードに保存できませんでした");
    }
  };
  return handleClick;
};
