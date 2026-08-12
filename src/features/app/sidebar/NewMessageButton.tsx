"use client";

import { Users } from "@/types/user";
import { getOrCreateDirectConversation } from "@/actions/getOrCreateDirectConversation";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type NewMessageButtonProps = {
  users: Users;
};

export default function NewMessageButton({ users }: NewMessageButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="default" />}>
        New Message
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {users.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                startTransition(async () => {
                  try {
                    setOpen(false);
                    const conversation = await getOrCreateDirectConversation(
                      user.id,
                    );
                    router.refresh();
                    router.push(`/DM/${conversation.id}`);
                  } catch (error) {
                    console.error(error);
                  }
                });
              }}
              disabled={isPending}
            >
              {user.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
