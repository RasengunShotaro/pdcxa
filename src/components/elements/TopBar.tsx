import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white h-16 px-6 flex items-center justify-between border-b z-50">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <h1 className="text-xl font-bold">PDCXA</h1>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <UserButton />
      </div>
    </header>
  );
}
