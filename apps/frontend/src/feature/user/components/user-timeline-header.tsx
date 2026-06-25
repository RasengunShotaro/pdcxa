import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";

interface UserTimelineHeaderProps {
  userName: string;
  userFullName?: string;
  imageUrl?: string;
}

export function UserTimelineHeader({
  userName,
  userFullName,
  imageUrl,
}: UserTimelineHeaderProps) {
  const hasFullName = userFullName !== undefined && userFullName.length > 0;
  const heading = hasFullName ? userFullName : `@${userName}`;
  const initialsSource = hasFullName ? userFullName : userName;

  return (
    <Card className="flex-row items-center gap-4 px-6 py-5">
      <Avatar className="size-16">
        <AvatarImage alt="" src={imageUrl ?? ""} />
        <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">
          {avatarInitials(initialsSource)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-foreground">
          {heading}
        </h1>
        {hasFullName ? (
          <p className="truncate text-sm text-muted-foreground">@{userName}</p>
        ) : null}
      </div>
    </Card>
  );
}
