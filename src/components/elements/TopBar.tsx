import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

type HeaderProps = {
  children: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 left-0 right-0 bg-white min-h-12 max-h-16 px-6 flex items-center justify-between border-b z-50">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <h1 className="text-xl font-bold">PDCXA</h1>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        {children}
        <UserButton />
      </div>
    </header>
  );
}
