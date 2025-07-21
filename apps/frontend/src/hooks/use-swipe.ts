import { useCallback, useEffect, useRef } from "react";

/**
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [isVisible, setIsVisible] = useState(true);
 *   useSwipe(setIsVisible);
 *
 *   return (
 *     <div className={`${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`>
 *       Content
 *     </div>
 *   );
 * };
 * ```
 */
export const useSwipe = (setIsVisible: (state: boolean) => void) => {
  const threshold = 0;
  const startYRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    startYRef.current = event.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (startYRef.current === null) return;

      const currentY = event.touches[0].clientY;
      const deltaY = currentY - startYRef.current;

      if (deltaY > threshold) {
        setIsVisible(true);
        startYRef.current = null;
      } else if (deltaY < -threshold) {
        setIsVisible(false);
        startYRef.current = null;
      }
    },
    [setIsVisible],
  );

  const handleTouchEnd = useCallback(() => {
    startYRef.current = null;
  }, []);

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
};
