"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NameForm } from "@/features/profile/components/name";
import { ProfileImage } from "@/features/profile/components/profile-image";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="w-fit mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">プロフィール設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 border-t pt-4">
            <ProfileImage user={user} />
          </div>
          <div className="space-y-4 border-t pt-4">
            <NameForm user={user} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
