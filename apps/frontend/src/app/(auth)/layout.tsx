import { LoginScene } from "@/feature/signin/components/login-scene/login-scene";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LoginScene>{children}</LoginScene>;
}
