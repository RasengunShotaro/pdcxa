const 反応し始める移動量 = 8;
const 画面の上端とみなす位置 = 16;

interface MobileBarCompactInput {
  previousY: number;
  currentY: number;
  compact: boolean;
}

export const 下部ナビを縮めるか = ({
  previousY,
  currentY,
  compact,
}: MobileBarCompactInput): boolean => {
  if (currentY <= 画面の上端とみなす位置) return false;
  const moved = currentY - previousY;
  if (moved >= 反応し始める移動量) return true;
  if (moved <= -反応し始める移動量) return false;
  return compact;
};
