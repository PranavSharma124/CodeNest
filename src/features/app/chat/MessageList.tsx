"use client";

import { WorkspaceMessage } from "@/types/chat";
import MessageItem from "./MessageItem";
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type MessageListProps = {
  messages: WorkspaceMessage[];
  conversationId: string;
};

export default function MessageList({
  messages,
  conversationId,
}: MessageListProps) {
  const [liveMessages, setLiveMessages] = useState(messages);

  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join-conversation", conversationId);
    };

    const handleNewMessage = (message: WorkspaceMessage) => {
      setLiveMessages((currentMessages) => [...currentMessages, message]);
    };

    socket.on("connect", handleConnect);
    socket.on("new-message", handleNewMessage);

    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit("join-conversation", conversationId);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new-message", handleNewMessage);
      socket.disconnect();
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {liveMessages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}
