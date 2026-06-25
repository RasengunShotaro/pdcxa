import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime } from "@/feature/pd/utils/format-datetime";
import { avatarInitials } from "./avatar-initials";

interface PdAuthorProps {
  userFullName: string;
  userName: string;
  imageUrl: string;
  createdAt: string;
}

export function PdAuthor({
  userFullName,
  userName,
  imageUrl,
  createdAt,
}: PdAuthorProps) {
  return (
    <div className="flex items-center gap-3">
      <Link
        className="-my-1 -ml-2 flex min-w-0 items-center gap-3 rounded-lg px-2 py-1 transition-[color,transform,background-color] hover:-translate-y-px hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        href={`/user/${userName}`}
      >
        <Avatar className="size-10">
          <AvatarImage alt="" src={imageUrl} />
          <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
            {avatarInitials(userFullName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold leading-normal text-foreground">
            {userFullName}
          </p>
          <p className="truncate text-sm leading-normal text-muted-foreground">
            @{userName}
          </p>
        </div>
      </Link>
      <time
        className="ml-auto shrink-0 self-start text-sm text-muted-foreground"
        dateTime={createdAt}
      >
        {formatDateTime(createdAt)}
      </time>
    </div>
  );
}
