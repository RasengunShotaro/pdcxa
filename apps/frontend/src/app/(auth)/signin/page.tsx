import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginSheet } from "@/feature/signin/components/login-scene/login-sheet";
import { SignInForm } from "@/feature/signin/components/signin-form";
import { getCurrentUser } from "@/lib/auth/server";

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) redirect("/");

  return (
    <LoginSheet
      description="メールアドレスとパスワードを入力してください。"
      footer={
        <Link
          aria-label="Reset password"
          className="justify-self-end px-1 text-sm underline decoration-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground"
          href="/signin/reset-password"
        >
          パスワードを忘れた場合
        </Link>
      }
      title="ログイン"
    >
      <SignInForm />
    </LoginSheet>
  );
}
