import { type ReactNode, useId } from "react";
import { LiquidGlass } from "@/components/elements/liquid-glass/liquid-glass";
import { cn } from "@/lib/utils";
import styles from "./login-scene.module.css";

interface LoginSheetProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function LoginSheet({
  title,
  description,
  children,
  footer,
}: LoginSheetProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className={cn(styles.sheet, "isolate w-full max-w-sm text-foreground")}
      data-login-sheet=""
    >
      <LiquidGlass
        bezel={30}
        blur={2.5}
        radius={28}
        strength={96}
        tone="clear"
      />
      <div aria-hidden="true" className={styles.scrim} data-login-scrim="" />
      <div className="grid gap-4" data-login-content="">
        <header className="grid gap-1 px-1 pt-1">
          <h1 className="text-xl font-medium" id={titleId}>
            {title}
          </h1>
          <p className="text-sm">{description}</p>
        </header>
        {children}
        {footer}
      </div>
    </section>
  );
}
