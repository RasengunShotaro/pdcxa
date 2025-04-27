"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileName } from "@/feature/profile/profile-name";
import { ProfilePicture } from "@/feature/profile/profile-picture";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="w-fit flex-auto max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">プロフィール設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-t pt-2 pb-2" />
          <ProfilePicture />
          <div className="border-t pt-2 pb-2" />
          <ProfileName />
        </CardContent>
      </Card>
    </div>
  );
}
