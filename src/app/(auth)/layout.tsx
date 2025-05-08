import { ColorModeSwitcher } from "@/components/elements/color-mode-switcher";
import { TextAnimate } from "@/components/ui/text-animate";
import Image from "next/image";
import Link from "next/link";

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
        <Link href="/" className=" pointer-events-auto">
          <Image
            src="/pdcxa.svg"
            alt="PDCXA"
            width={170}
            height={40}
            className="invert"
            priority
          />
        </Link>
        <TextAnimate
          animation="blurInUp"
          by="character"
          duration={1}
          className="pl-1 text-white/80 text-sm font-light tracking-wider pointer-events-none"
        >
          New PD, New World.
        </TextAnimate>
      </div>
      <div className="fixed inset-0 lg:hidden">
        <Image
          src={backgroundImage}
          alt="スマホ背景"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative hidden lg:block">
        <Image
          src={backgroundImage}
          alt="PC背景"
          fill
          className="object-cover"
          priority
        />
        <div className="fixed inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
      </div>
      <div className="flex items-center justify-center p-8 relative">
        <div className="flex-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
