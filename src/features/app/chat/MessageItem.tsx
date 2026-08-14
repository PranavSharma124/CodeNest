"use client";

import { useState } from "react";
import { WorkspaceMessage } from "@/types/chat";
import { editMessage } from "@/actions/editMessage";
import { Button } from "@/components/ui/button";

type MessageItemProps = {
  message: WorkspaceMessage;
  currentUserId: string;
};

export default function MessageItem({
  message,
  currentUserId,
}: MessageItemProps) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(message.content);
  const [loading, setLoading] = useState(false);

  const isOwner = message.senderId === currentUserId;

  const handleSave = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      setLoading(true);

      await editMessage(message.id, content);

      setEditing(false);
    } catch (error) {
      console.error("Failed to edit message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent(message.content);
    setEditing(false);
  };

  return (
    <div className="p-2">
      <strong>{message.sender.name}</strong>

      {editing ? (
        <div className="space-y-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            className="w-full rounded-md border px-2 py-1"
          />

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p>{message.content}</p>

          {isOwner && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </>
      )}
    </div>
  );
}
