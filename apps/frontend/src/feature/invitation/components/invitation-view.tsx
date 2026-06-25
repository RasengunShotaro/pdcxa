import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvitationForm } from "./invitation-form";

export function InvitationView() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">PDCXA に招待する</CardTitle>
          <CardDescription>
            入力したアドレス宛に登録リンクを送ります。
            <br />
            迷惑メールに振り分けられることがあります。
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <InvitationForm />
        </CardContent>
      </Card>
    </div>
  );
}
