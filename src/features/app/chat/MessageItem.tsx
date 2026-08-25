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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="group flex gap-3 px-5 py-2 transition-colors hover:bg-accent/40">
      <Avatar className="h-10 w-10 shrink-0 border border-border">
        <AvatarImage
          src={message.sender.image ?? undefined}
          alt={message.sender.name}
        />

        <AvatarFallback className="bg-muted text-sm font-medium text-muted-foreground">
          {message.sender.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <strong className="text-sm font-semibold text-foreground">
            {message.sender.name}
          </strong>

          <span className="text-xs text-muted-foreground/70">
            {new Date(message.createdAt).toISOString().slice(11, 16)}
          </span>
        </div>

        {message.isDeleted ? (
          <p className="mt-1 text-sm italic text-muted-foreground/70">
            This message was deleted.
          </p>
        ) : editing ? (
          <div className="mt-2 max-w-3xl space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={5}
              className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
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
            <div className="mt-1 max-w-3xl text-sm leading-6 text-foreground/90">
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
                        className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
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
            </div>

            {isOwner && (
              <div className="mt-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                        disabled={loading}
                      />
                    }
                  >
                    Delete
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this message?</AlertDialogTitle>

                      <AlertDialogDescription>
                        This message will be marked as deleted for everyone in
                        the conversation.
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
    </div>
  );
}
