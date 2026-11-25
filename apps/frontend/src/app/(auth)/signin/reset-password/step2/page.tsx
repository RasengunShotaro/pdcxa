import { LoginSheet } from "@/feature/signin/components/login-scene/login-sheet";
import { ResetPasswordOtpForm } from "@/feature/signin/components/reset-password-form-otp";

export default function ResetPasswordStep2Page() {
  return (
    <LoginSheet
      description="メールアドレスと確認コードを入力してください。"
      title="パスワードをリセット"
    >
      <ResetPasswordOtpForm />
    </LoginSheet>
  );
}
