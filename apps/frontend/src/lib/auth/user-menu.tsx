"use client";

import { UserButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_USER } from "./mock-user";
import { AUTH_MOCKING } from "./mocking";

function MockUserMenu() {
  return (
    <Avatar className="size-7">
      <AvatarImage
        alt={MOCK_USER.fullName ?? "ユーザー"}
        src={MOCK_USER.imageUrl}
      />
      <AvatarFallback>
        {(MOCK_USER.firstName ?? "U").slice(0, 1)}
      </AvatarFallback>
    </Avatar>
  );
}

export const UserMenu = AUTH_MOCKING ? MockUserMenu : UserButton;
