import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/components/elements/signin-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignInPage() {
  const user = await currentUser();

  if (user) redirect("/");

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl mb-2">ログイン</CardTitle>
        <CardDescription>
          メールアドレスとパスワードを入力してください。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <span className="py-1" />
        <SignInForm />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-end gap-2">
        <Link
          aria-label="Reset password"
          href="/signin/reset-password"
          className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
        >
          パスワードを忘れた場合
        </Link>
      </CardFooter>
    </Card>
  );
}
