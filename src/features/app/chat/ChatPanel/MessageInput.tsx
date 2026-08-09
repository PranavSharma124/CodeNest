import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

export default function MessageInput() {
  return (
    <footer className="flex items-center gap-2 border p-4">
      <Input type="text" placeholder="Type a message..." className="flex-1" />

      <Button size="icon">
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </footer>
  );
}
