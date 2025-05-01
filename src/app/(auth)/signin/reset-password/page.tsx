import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/feature/signin/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl ">
          パスワード再設定メールを送る
        </CardTitle>
        <CardDescription>
          メールアドレスを入力してください。確認コードを送信します。
        </CardDescription>
      </CardHeader>
      <span className="py-3" />
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
