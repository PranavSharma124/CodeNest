"use client";

import { WorkspaceMessage } from "@/types/chat";
import MessageItem from "./MessageItem";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

type MessageListProps = {
  messages: WorkspaceMessage[];
  conversationId: string;
  currentUserId: string;
};

export default function MessageList({
  messages,
  conversationId,
  currentUserId,
}: MessageListProps) {
  const [liveMessages, setLiveMessages] = useState(messages);

  const containerRef = useRef<HTMLDivElement>(null);

  const shouldAutoScroll = useRef(true);

  const initialScroll = useRef(true);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected", socket.id);

      socket.emit("join-conversation", conversationId);
    };

    const handleNewMessage = (message: WorkspaceMessage) => {
      console.log("Received new-message:", message);

      const container = containerRef.current;

      if (container) {
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;

        shouldAutoScroll.current = distanceFromBottom < 150;
      }

      setLiveMessages((currentMessages) => [...currentMessages, message]);
    };

    const handleMessageUpdated = (message: WorkspaceMessage) => {
      console.log("Received message-updated:", message);

      setLiveMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === message.id ? message : currentMessage,
        ),
      );
    };

    const handleMessageDeleted = (message: WorkspaceMessage) => {
      console.log("Received message-deleted:", message);

      setLiveMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === message.id ? message : currentMessage,
        ),
      );
    };

    socket.on("connect", handleConnect);
    socket.on("new-message", handleNewMessage);
    socket.on("message-updated", handleMessageUpdated);
    socket.on("message-deleted", handleMessageDeleted);

    if (socket.connected) {
      socket.emit("join-conversation", conversationId);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new-message", handleNewMessage);
      socket.off("message-updated", handleMessageUpdated);
      socket.off("message-deleted", handleMessageDeleted);
    };
  }, [conversationId]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (initialScroll.current) {
      container.scrollTop = container.scrollHeight;
      initialScroll.current = false;
      return;
    }

    if (shouldAutoScroll.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [liveMessages.length]);

  return (
    <div
      ref={containerRef}
      className="min-h-0 flex-1 overflow-y-auto bg-background pb-4"
    >
      {liveMessages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
