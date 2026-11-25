import {
  画面の種類を決める,
  開いているPDのIDを求める,
} from "@/components/elements/nav-items";

interface SelectedPdInput {
  pathname: string;
  firstPdId: string | undefined;
}

export const 選択中のPDを決める = ({
  pathname,
  firstPdId,
}: SelectedPdInput): string | undefined => {
  const openedPdId = 開いているPDのIDを求める(pathname);
  if (openedPdId) return openedPdId;
  const screen = 画面の種類を決める(pathname);
  return screen === "timeline" || screen === "user" ? firstPdId : undefined;
};
