import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ColorModeSwitcher } from "@/components/elements/color-mode-switcher";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";
import { DropletCanvas } from "./droplet-canvas";
import styles from "./login-scene.module.css";

interface LoginSceneProps {
  children: ReactNode;
}

export function LoginScene({ children }: LoginSceneProps) {
  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <DropletCanvas />
      <div className={cn(styles.ink, "fixed top-8 left-8 z-10")}>
        <Link className="pointer-events-auto block" href="/">
          <Image
            alt="PDCXA"
            className="h-10 w-auto"
            height={40}
            priority
            src="/pdcxa.svg"
            width={170}
          />
        </Link>
        <TextAnimate
          animation="blurInUp"
          by="character"
          className="pointer-events-none pl-1 text-sm font-normal tracking-wider"
          duration={1}
        >
          New PD, New World.
        </TextAnimate>
      </div>
      <div className="fixed top-8 right-8 z-10">
        <div className={cn(styles.glass, styles.chip)}>
          <ColorModeSwitcher />
        </div>
      </div>
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-6 py-28 lg:justify-end lg:pr-[8vw]">
        {children}
      </div>
    </main>
  );
}
