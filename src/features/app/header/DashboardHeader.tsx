import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function DashboardHeader() {
  return (
    <header className="flex items-center px-8 py-4 border">
      <h1 className="text-2xl font-bold ">CodeNest</h1>

      <form className="flex-1 px-8 " role="search">
        <div className="flex items-center gap-2 rounded-md border px-3 h-10 bg-muted">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="w-full outline-none bg-transparent placeholder:text-muted-foreground"
            placeholder="Search projects, people..."
          />
        </div>
      </form>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="relative flex">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="Pranav Sharma" />
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
        </div>
      </div>
    </header>
  );
}
