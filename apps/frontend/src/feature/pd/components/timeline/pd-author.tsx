import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 著者の名前を決める } from "@/feature/pd/utils/author-display";
import { UserBadges } from "@/feature/user/badges/user-badges";
import { cn } from "@/lib/utils";
import { avatarInitials } from "./avatar-initials";
import { PdTimestamp } from "./pd-timestamp";

type AvatarSize = "reply" | "row" | "detail";

const AVATAR_SIZE_CLASS: Record<AvatarSize, string> = {
  reply: "size-[34px]",
  row: "size-10",
  detail: "size-12",
};

interface PdAvatarProps {
  userFullName: string;
  userName: string;
  imageUrl: string;
  size?: AvatarSize;
}

export function PdAvatar({
  userFullName,
  userName,
  imageUrl,
  size = "row",
}: PdAvatarProps) {
  const avatar = (
    <Avatar className={AVATAR_SIZE_CLASS[size]}>
      <AvatarImage alt="" src={imageUrl} />
      <AvatarFallback className="bg-brand-soft text-sm font-bold text-ink">
        {avatarInitials(userFullName)}
      </AvatarFallback>
    </Avatar>
  );

  if (!userName) {
    return <div className="shrink-0">{avatar}</div>;
  }

  return (
    <Link
      aria-label={`${userFullName}さんのページ`}
      className="relative z-[1] h-fit shrink-0 rounded-full transition-[opacity,translate] hover:-translate-y-px hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      href={`/user/${userName}`}
    >
      {avatar}
    </Link>
  );
}

interface PdAuthorNameProps {
  userFullName: string;
  userName: string;
  className?: string;
}

export function PdAuthorName({
  userFullName,
  userName,
  className,
}: PdAuthorNameProps) {
  const { name } = 著者の名前を決める({ userFullName, userName });
  const nameClassName = cn(
    "min-w-0 truncate text-[0.9375rem] font-bold text-ink",
    className,
  );

  if (!userName) {
    return <span className={nameClassName}>{name}</span>;
  }

  return (
    <Link
      className={cn(
        nameClassName,
        "relative z-[1] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      )}
      href={`/user/${userName}`}
    >
      {name}
    </Link>
  );
}

interface PdAuthorLineProps {
  userFullName: string;
  userName: string;
  createdAt: string;
  href?: string;
  badges?: readonly string[];
}

export function PdAuthorLine({
  userFullName,
  userName,
  createdAt,
  href,
  badges = [],
}: PdAuthorLineProps) {
  const { handle } = 著者の名前を決める({ userFullName, userName });

  return (
    <div className="flex min-w-0 items-baseline gap-2 text-[0.8125rem] leading-[1.4] text-ink-3">
      <PdAuthorName userFullName={userFullName} userName={userName} />
      <span className="relative z-[1] inline-flex shrink-0 self-center empty:hidden">
        <UserBadges badgeIds={badges} />
      </span>
      {handle ? (
        <span className="min-w-10 shrink-[2] truncate">@{handle}</span>
      ) : null}
      <PdTimestamp
        className="relative z-[1] ml-auto shrink-0 text-[0.8125rem] text-ink-3 tabular-nums"
        createdAt={createdAt}
        href={href}
      />
    </div>
  );
}
