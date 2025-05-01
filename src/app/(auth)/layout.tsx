import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      <Image
        src="/static/pdcxa.svg"
        alt="PDCXA"
        width={170}
        height={40}
        className="fixed top-8 left-8 z-10 invert pointer-events-none"
        priority
      />
      <p className="fixed top-20 left-8 z-10 text-white/80 text-sm font-light tracking-wider pointer-events-none">
        New PD, New World.
      </p>
      <div className="fixed inset-0 lg:hidden">
        <Image
          src="/static/background.png"
          alt="スマホ背景"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative hidden lg:block">
        <Image
          src="/static/background.png"
          alt="PC背景"
          fill
          className="object-cover"
          priority
        />
        <div className="fixed inset-0 bg-gradient-to-t from-background/100 via-background/30 to-transparent" />
      </div>
      <div className="flex items-center justify-center p-8 relative">
        <div className="flex-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
