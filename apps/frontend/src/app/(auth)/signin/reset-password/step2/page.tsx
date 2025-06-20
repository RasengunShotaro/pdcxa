import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordOtpForm } from "@/feature/signin/components/reset-password-form-otp";

export default function ResetPasswordStep2Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">パスワードをリセット</CardTitle>
        <CardDescription>
          メールアドレスと確認コードを入力してください。
        </CardDescription>
      </CardHeader>
      <span className="py-3" />
      <CardContent>
        <ResetPasswordOtpForm />
      </CardContent>
    </Card>
  );
}
