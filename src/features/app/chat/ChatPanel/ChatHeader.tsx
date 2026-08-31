"use client";

import {
  MessageCircle,
  MoreVertical,
  Users,
  UserPlus,
  Trash2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import MembersDialog from "@/features/workspace/MembersDialog";
import AddMembersDialog from "@/features/workspace/AddMembersDialog";
import DeleteWorkspaceDialog from "@/features/workspace/DeleteWorkspaceDialog";
import { leaveWorkspace } from "@/actions/leaveWorkspace";

type ChatHeaderProps = {
  workspace?: {
    id: string;
    name: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
  };
};

export default function ChatHeader({ workspace }: ChatHeaderProps) {
  const [membersOpen, setMembersOpen] = useState(false);
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleLeaveWorkspace = async () => {
    if (!workspace || workspace.role === "OWNER") {
      return;
    }

    try {
      setLeaving(true);

      await leaveWorkspace(workspace.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLeaving(false);
    }
  };

  const isWorkspace = Boolean(workspace);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center border-b border-border bg-card px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {workspace?.name ?? "Direct Message"}
            </h3>

            <p className="text-xs text-muted-foreground">
              {isWorkspace ? "Workspace" : "Direct Message"}
            </p>
          </div>
        </div>

        {workspace && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Workspace options"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground"
                />
              }
            >
              <MoreVertical className="h-5 w-5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setMembersOpen(true)}>
                <Users />
                Members
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setAddMembersOpen(true)}>
                <UserPlus />
                Add people
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {workspace.role === "OWNER" ? (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 />
                  Delete workspace
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLeaveWorkspace}
                  disabled={leaving}
                >
                  <LogOut />
                  {leaving ? "Leaving..." : "Leave workspace"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>

      {workspace && (
        <>
          <MembersDialog
            workspaceId={workspace.id}
            open={membersOpen}
            onOpenChange={setMembersOpen}
          />

          <AddMembersDialog
            workspaceId={workspace.id}
            open={addMembersOpen}
            onOpenChange={setAddMembersOpen}
          />

          <DeleteWorkspaceDialog
            workspaceId={workspace.id}
            workspaceName={workspace.name}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          />
        </>
      )}
    </>
  );
}
