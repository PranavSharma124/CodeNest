"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/actions/sendMessage";

type MessageInputProps = {
  conversationId: string;
};

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await sendMessage(conversationId, content);
      setContent("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        placeholder="Type a message..."
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
