import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InvitationForm } from "@/feature/invitation/components/invitation-form";

export default function Page() {
  return (
    <div className="flex-auto max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>招待を送信</CardTitle>
          <CardDescription>
            招待は迷惑メールフォルダに振り分けられる可能性があります。
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <InvitationForm />
        </CardContent>
      </Card>
    </div>
  );
}
