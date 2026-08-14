"use client";

import { useState } from "react";
import { WorkspaceMessage } from "@/types/chat";
import { editMessage } from "@/actions/editMessage";
import { deleteMessage } from "@/actions/deleteMessage";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteMessage(message.id);
    } catch (error) {
      console.error("Failed to delete message:", error);
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

      {message.isDeleted ? (
        <p className="text-muted-foreground italic">
          This message was deleted.
        </p>
      ) : editing ? (
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            rows={5}
            className="w-full resize-y rounded-md border px-3 py-2 outline-none"
            placeholder="Edit your message..."
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
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");

                return match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="rounded bg-muted px-1 py-0.5 text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>

          {isOwner && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button variant="ghost" size="sm" disabled={loading} />
                  }
                >
                  Delete
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this message?</AlertDialogTitle>

                    <AlertDialogDescription>
                      This message will be marked as deleted for everyone in the
                      conversation.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </>
      )}
    </div>
  );
}
