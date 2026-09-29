import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  BADGE_CATALOG,
  type BadgeId,
  表示するバッジに絞る,
} from "./badge-catalog";

interface UserBadgesProps {
  badgeIds: readonly string[];
  focusable?: boolean;
}

export function UserBadges({ badgeIds, focusable = true }: UserBadgesProps) {
  const badges = 表示するバッジに絞る(badgeIds);

  if (badges.length === 0) {
    return null;
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 self-center">
      {badges.map((badgeId) => (
        <UserBadge badgeId={badgeId} focusable={focusable} key={badgeId} />
      ))}
    </span>
  );
}

interface UserBadgeProps {
  badgeId: BadgeId;
  focusable: boolean;
}

function UserBadge({ badgeId, focusable }: UserBadgeProps) {
  const {
    label,
    description,
    icon: Icon,
    className,
    iconClassName,
  } = BADGE_CATALOG[badgeId];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          className={cn("max-md:px-1", className)}
          tabIndex={focusable ? 0 : undefined}
          variant="glow"
        >
          <Icon aria-hidden="true" className={cn("size-3.5", iconClassName)} />
          <span className="sr-only md:not-sr-only">{label}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  );
}
