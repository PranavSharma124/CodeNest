"use client";

import { useEffect, useState } from "react";
import { getWorkspaceMembers } from "@/actions/getWorkspaceMembers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Member = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

type MembersDialogProps = {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MembersDialog({
  workspaceId,
  open,
  onOpenChange,
}: MembersDialogProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadMembers = async () => {
      setLoading(true);

      try {
        const result = await getWorkspaceMembers(workspaceId);
        setMembers(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [open, workspaceId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workspace Members</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Loading members...</p>
        ) : members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={member.user.image ?? undefined}
                    alt={member.user.name}
                  />
                  <AvatarFallback>
                    {getInitials(member.user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="font-medium">{member.user.name}</p>

                  <p className="truncate text-sm text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>

                <span className="text-sm text-muted-foreground">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
