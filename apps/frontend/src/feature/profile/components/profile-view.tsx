"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import {
  useUpdateProfileName,
  useUpdateProfilePicture,
} from "@/lib/auth/use-update-profile";
import { ProfileNameField } from "./profile-name-field";
import { ProfilePictureField } from "./profile-picture-field";

function ProfileSkeleton() {
  return (
    <div
      aria-label="プロフィールを読み込み中"
      className="flex flex-col items-center gap-4"
      role="status"
    >
      <Skeleton className="size-24 rounded-full" />
      <Skeleton className="h-10 w-40" />
      <Separator />
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </div>
  );
}

export function ProfileView() {
  const { user } = useCurrentUser();
  const { updateProfileName } = useUpdateProfileName();
  const { updateProfilePicture } = useUpdateProfilePicture();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardContent className="space-y-4">
          <CardTitle className="text-xl font-bold">プロフィール設定</CardTitle>
          <Separator />
          {user ? (
            <>
              <section
                aria-labelledby="profile-picture-heading"
                className="space-y-4"
              >
                <h2
                  className="text-base font-medium text-muted-foreground"
                  id="profile-picture-heading"
                >
                  プロフィール画像
                </h2>
                <ProfilePictureField
                  displayName={user.fullName ?? "ユーザー"}
                  imageUrl={user.imageUrl}
                  onUpload={updateProfilePicture}
                />
              </section>
              <Separator />
              <section
                aria-labelledby="profile-name-heading"
                className="space-y-4"
              >
                <h2
                  className="text-base font-medium text-muted-foreground"
                  id="profile-name-heading"
                >
                  表示名
                </h2>
                <ProfileNameField
                  defaultValues={{
                    firstName: user.firstName ?? "",
                    lastName: user.lastName ?? "",
                  }}
                  onSubmit={updateProfileName}
                />
              </section>
            </>
          ) : (
            <ProfileSkeleton />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
