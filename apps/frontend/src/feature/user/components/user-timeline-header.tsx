import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <div className="flex items-center gap-4 border-b border-border px-4 py-5">
      <Avatar className="size-16">
        <AvatarImage alt="" src={imageUrl ?? ""} />
        <AvatarFallback className="bg-primary-50 text-lg font-medium text-primary-600 dark:bg-primary/15 dark:text-primary-300">
          {avatarInitials(initialsSource)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <h2 className="truncate text-xl font-bold text-foreground">
          {heading}
        </h2>
        {hasFullName ? (
          <p className="truncate text-sm text-muted-foreground">@{userName}</p>
        ) : null}
      </div>
    </div>
  );
}
