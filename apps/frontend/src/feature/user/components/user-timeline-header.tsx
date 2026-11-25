import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import { UserBadges } from "@/feature/user/badges/user-badges";

interface UserTimelineHeaderProps {
  userName: string;
  userFullName?: string;
  imageUrl?: string;
  badges?: readonly string[];
}

export function UserTimelineHeader({
  userName,
  userFullName,
  imageUrl,
  badges = [],
}: UserTimelineHeaderProps) {
  const hasFullName = userFullName !== undefined && userFullName.length > 0;
  const heading = hasFullName ? userFullName : `@${userName}`;
  const initialsSource = hasFullName ? userFullName : userName;

  return (
    <div className="mx-3.5 mb-2 flex items-center gap-4 border-b border-line py-5">
      <Avatar className="size-16">
        <AvatarImage alt="" src={imageUrl ?? ""} />
        <AvatarFallback className="bg-brand-soft text-[1.125rem] font-bold text-ink">
          {avatarInitials(initialsSource)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-[1.25rem] leading-[1.4] font-bold text-ink">
            {heading}
          </h2>
          <UserBadges badgeIds={badges} />
        </div>
        {hasFullName ? (
          <p className="truncate text-[0.8125rem] text-ink-3">@{userName}</p>
        ) : null}
      </div>
    </div>
  );
}
