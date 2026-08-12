"use client";

import { Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SignoutButton from "@/components/auth/SignoutButton";

type ProfileMenuProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </summary>

        <div className="absolute right-0 z-50 mt-2 w-64 rounded-md border bg-background p-2 shadow-md">
          <div className="px-3 py-2">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="my-1 border-t" />

          <Button variant="ghost" className="w-full justify-start" disabled>
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>

          <Button variant="ghost" className="w-full justify-start" disabled>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>

          <SignoutButton />
        </div>
      </details>
    </div>
  );
}
