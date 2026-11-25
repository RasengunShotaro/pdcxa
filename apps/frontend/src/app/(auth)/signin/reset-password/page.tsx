import { LoginSheet } from "@/feature/signin/components/login-scene/login-sheet";
import { ResetPasswordForm } from "@/feature/signin/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <LoginSheet
      description="メールアドレスを入力してください。確認コードを送信します。"
      title="パスワード再設定メールを送る"
    >
      <ResetPasswordForm />
    </LoginSheet>
  );
}
