import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileMenu from "../appheader/ProfileMenu";

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

      <form className="flex-1 px-8" role="search">
        <div className="flex h-10 items-center gap-2 rounded-md border bg-muted px-3">
          <Search className="h-4 w-4 text-muted-foreground" />

          <input
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder="Search projects, people..."
          />
        </div>
      </form>

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
