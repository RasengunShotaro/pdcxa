import Image from "next/image";
import Link from "next/link";
import { ColorModeSwitcher } from "@/components/elements/color-mode-switcher";
import { TextAnimate } from "@/components/ui/text-animate";

const backgroundImages = [
  "/bg-1.webp",
  "/bg-2.webp",
  "/bg-3.webp",
  "/bg-4.webp",
] as const;

const getRandomBackground = (): string => {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  return backgroundImages[randomIndex];
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const backgroundImage = getRandomBackground();
  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      <div className="fixed top-8 right-8 z-10">
        <ColorModeSwitcher />
      </div>
      <div className="fixed top-8 left-8 z-10">
        <Link className=" pointer-events-auto" href="/">
          <Image
            alt="PDCXA"
            className="invert"
            height={40}
            priority
            src="/pdcxa.svg"
            width={170}
          />
        </Link>
        <TextAnimate
          animation="blurInUp"
          by="character"
          className="pl-1 text-white/80 text-sm font-light tracking-wider pointer-events-none"
          duration={1}
        >
          New PD, New World.
        </TextAnimate>
      </div>
      <div className="fixed inset-0 lg:hidden">
        <Image
          alt="スマホ背景"
          className="object-cover"
          fill
          priority
          src={backgroundImage}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative hidden lg:block">
        <Image
          alt="PC背景"
          className="object-cover"
          fill
          priority
          src={backgroundImage}
        />
        <div className="fixed inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </div>
      <div className="flex items-center justify-center p-8 relative">
        <div className="flex-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
