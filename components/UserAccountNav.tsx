"use client";

import Link from "next/link";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";

import { ROLE } from "@/lib/role";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/UserAvatar";

export interface UserAccountNavProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const session = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.name || undefined,
            image: user.image || undefined,
          }}
          className="h-10 w-10"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white dark:bg-stone-900 mt-3"
        align="end"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Dashboard</Link>
        </DropdownMenuItem>

        {session.data?.user.role && session.data?.user.role <= ROLE.HW && (
          <DropdownMenuItem asChild>
            <Link href="/config">Configurazioni</Link>
          </DropdownMenuItem>
        )}
        {session.data?.user.role &&
          (session.data?.user.role == ROLE.DMT ||
            session.data?.user.role == ROLE.MT) && (
            <DropdownMenuItem asChild>
              <Link href="/config/car">Configurazioni</Link>
            </DropdownMenuItem>
          )}

        <DropdownMenuItem asChild>
          <Link href="/settings">Impostazioni</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event: any) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
