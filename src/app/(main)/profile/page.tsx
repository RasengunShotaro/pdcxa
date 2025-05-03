import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileNameForm } from "@/feature/profile/profile-name-form";
import { ProfilePictureForm } from "@/feature/profile/profile-picture-form";

export default function Page() {
  return (
    <div className="flex-auto max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">プロフィール設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-t pt-2 pb-2" />
          <div className="flex flex-col mb-4">
            <h3 className="text-lg font-semibold">プロフィール画像</h3>
            <p className="text-sm font-normal text-muted-foreground">
              画像の比率が1:1でない場合、プレビューが実際と乖離します。
              <br />
              画像は10MB以下である必要があります。
            </p>
          </div>
          <ProfilePictureForm />
          <div className="border-t pt-2 pb-2" />
          <div className="flex flex-col mb-4">
            <h3 className="text-lg font-semibold">表示名</h3>
            <p className="text-sm font-normal text-muted-foreground">
              First Name、Last Nameを1～10文字で入力してください。
            </p>
          </div>
          <ProfileNameForm />
        </CardContent>
      </Card>
    </div>
  );
}
