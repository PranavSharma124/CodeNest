"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/actions/sendMessage";
import { Send } from "lucide-react";

type MessageInputProps = {
  conversationId: string;
};

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;

    setLoading(true);

    try {
      await sendMessage(conversationId, content);
      setContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex items-end gap-2 rounded-lg border bg-background p-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={3}
          placeholder="Write a message..."
          className="max-h-40 min-h-20 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
        />

        <Button
          type="button"
          size="icon"
          onClick={() => void handleSubmit()}
          disabled={loading || !content.trim()}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <p className="mt-1 px-1 text-xs text-muted-foreground">
        Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}
