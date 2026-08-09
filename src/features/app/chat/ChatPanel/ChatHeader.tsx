import { MessageCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatHeader() {
  return (
    <header className="flex items-center border-b px-6 py-4">
      <div className="flex flex-1 items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3>CodeNest</h3>
      </div>

      <Button variant="ghost" size="icon">
        <MoreVertical className="h-5 w-5" />
      </Button>

    </header>
  );
}
