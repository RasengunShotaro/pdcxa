interface 画面上の点 {
  readonly x: number;
  readonly y: number;
}

interface ガラスの位置 {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface ガラスに当たる光 {
  readonly x: number;
  readonly y: number;
  readonly intensity: number;
}

const 光が届く距離 = 220;

export const ガラスに当たる光を求める = ({
  pointer,
  rect,
}: {
  pointer: 画面上の点;
  rect: ガラスの位置;
}): ガラスに当たる光 => {
  const x = pointer.x - rect.left;
  const y = pointer.y - rect.top;
  const outsideX = Math.max(-x, 0, x - rect.width);
  const outsideY = Math.max(-y, 0, y - rect.height);
  const distance = Math.hypot(outsideX, outsideY);
  const intensity = Math.max(0, 1 - distance / 光が届く距離);
  return {
    x: Math.round(x),
    y: Math.round(y),
    intensity: Math.round(intensity * 100) / 100,
  };
};

const elements = new Set<HTMLElement>();
const state = { frame: 0, pointer: { x: -9999, y: -9999 } };

const 光を当て直す = (): void => {
  state.frame = 0;
  for (const element of elements) {
    const light = ガラスに当たる光を求める({
      pointer: state.pointer,
      rect: element.getBoundingClientRect(),
    });
    element.style.setProperty("--glass-light-x", `${light.x}px`);
    element.style.setProperty("--glass-light-y", `${light.y}px`);
    element.style.setProperty("--glass-light", `${light.intensity}`);
  }
};

const ポインターを追う = (event: PointerEvent): void => {
  state.pointer = { x: event.clientX, y: event.clientY };
  if (state.frame === 0) state.frame = requestAnimationFrame(光を当て直す);
};

export const ガラスをポインターの光で照らす = (
  element: HTMLElement,
): (() => void) => {
  if (elements.size === 0) {
    window.addEventListener("pointermove", ポインターを追う, { passive: true });
  }
  elements.add(element);
  return () => {
    elements.delete(element);
    if (elements.size > 0) return;
    window.removeEventListener("pointermove", ポインターを追う);
    cancelAnimationFrame(state.frame);
    state.frame = 0;
  };
};
