"use client";

import { useEffect, useState } from "react";
import { getAddableWorkspaceUsers } from "@/actions/getAddableWorkspaceUsers";
import { addWorkspaceMember } from "@/actions/addWorkspaceMember";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type AddMembersDialogProps = {
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

export default function AddMembersDialog({
  workspaceId,
  open,
  onOpenChange,
}: AddMembersDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingUserId, setAddingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const loadUsers = async () => {
      setLoading(true);

      try {
        const result = await getAddableWorkspaceUsers(workspaceId);
        setUsers(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [open, workspaceId]);

  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase().trim();

    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  const handleAdd = async (userId: string) => {
    setAddingUserId(userId);

    try {
      await addWorkspaceMember(workspaceId, userId);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== userId),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setAddingUserId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add People</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading people...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No people available to add.
          </p>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-md p-2"
              >
                <Avatar>
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleAdd(user.id)}
                  disabled={addingUserId === user.id}
                >
                  {addingUserId === user.id ? "Adding..." : "Add"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
