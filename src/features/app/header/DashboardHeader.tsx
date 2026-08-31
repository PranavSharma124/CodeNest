import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileMenu from "../appheader/ProfileMenu";
import SearchBar from "./SearchBar";

type DashboardHeaderProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  onMenuClick?: () => void;
};

export default function DashboardHeader({
  user,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-card px-6">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open sidebar"
        className="mr-2 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="shrink-0 text-xl font-semibold tracking-tight">
        <span className="text-foreground">Code</span>
        <span className="text-primary">Nest</span>
      </h1>

      <div className="mx-8 flex min-w-0 flex-1 justify-center">
        <SearchBar />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <ProfileMenu user={user} />
      </div>
    </header>
  );
}
