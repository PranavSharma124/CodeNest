import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileMenu from "../appheader/ProfileMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "./SearchBar";

type DashboardHeaderProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="flex items-center border px-8 py-4">
      <h1 className="text-2xl font-bold">CodeNest</h1>

      <SearchBar />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <ProfileMenu user={user} />

        <span className="absolute right-8 mt-8 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
      </div>
    </header>
  );
}
