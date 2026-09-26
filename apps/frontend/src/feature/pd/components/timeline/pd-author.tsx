import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarInitials } from "./avatar-initials";
import { PdTimestamp } from "./pd-timestamp";

interface PdAvatarProps {
  userFullName: string;
  userName: string;
  imageUrl: string;
}

export function PdAvatar({ userFullName, userName, imageUrl }: PdAvatarProps) {
  const avatar = (
    <Avatar className="size-10">
      <AvatarImage alt="" src={imageUrl} />
      <AvatarFallback className="bg-primary-50 text-sm font-medium text-primary-600 dark:bg-primary/15 dark:text-primary-300">
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
      className="shrink-0 rounded-full transition-[opacity,translate] hover:-translate-y-px hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      href={`/user/${userName}`}
    >
      {avatar}
    </Link>
  );
}

interface PdAuthorLineProps {
  userFullName: string;
  userName: string;
  createdAt: string;
  href?: string;
}

export function PdAuthorLine({
  userFullName,
  userName,
  createdAt,
  href,
}: PdAuthorLineProps) {
  return (
    <div className="flex min-w-0 items-baseline gap-1 text-sm leading-normal">
      {userName ? (
        <Link
          className="truncate font-bold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          href={`/user/${userName}`}
        >
          {userFullName}
        </Link>
      ) : (
        <span className="truncate font-bold text-foreground">
          {userFullName}
        </span>
      )}
      {userName ? (
        <span className="min-w-0 shrink truncate text-muted-foreground">
          @{userName}
        </span>
      ) : null}
      <span aria-hidden="true" className="shrink-0 text-muted-foreground">
        ·
      </span>
      <PdTimestamp className="shrink-0" createdAt={createdAt} href={href} />
    </div>
  );
}
