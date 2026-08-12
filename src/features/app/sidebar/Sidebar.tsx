"use client";

import { useEffect, useState } from "react";
import { Users } from "@/types/user";
import SidebarSection from "./SidebarSection";
import NewMessageButton from "./NewMessageButton";
import { DirectConversations } from "@/types/directConversation";
import DirectMessagesSection from "./DirectMessagesSection";
import NewWorkspaceButton from "./NewWorkspaceButton";
import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";

type WorkspaceItem = {
  id: string;
  name: string;
};

type SidebarProps = {
  workspaces: WorkspaceItem[];
  users: Users;
  directConversations: DirectConversations;
};

export default function Sidebar({
  workspaces,
  users,
  directConversations,
}: SidebarProps) {
  const router = useRouter();
  const [deletedWorkspaceIds, setDeletedWorkspaceIds] = useState<Set<string>>(
    new Set(),
  );

  const visibleWorkspaces = workspaces.filter(
    (workspace) => !deletedWorkspaceIds.has(workspace.id),
  );

  useEffect(() => {
    const handleWorkspaceAdded = () => {
      console.log("Workspace added — refreshing sidebar");

      router.refresh();
    };

    const handleWorkspaceDeleted = ({
      workspaceId,
    }: {
      workspaceId: string;
    }) => {
      console.log("Removing deleted workspace from sidebar:", workspaceId);

      setDeletedWorkspaceIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(workspaceId);
        return nextIds;
      });
    };

    socket.on("workspace-added", handleWorkspaceAdded);
    socket.on("workspace-deleted", handleWorkspaceDeleted);

    return () => {
      socket.off("workspace-added", handleWorkspaceAdded);
      socket.off("workspace-deleted", handleWorkspaceDeleted);
    };
  }, []);

  return (
    <aside className="w-64 border p-4 space-y-6">
      <SidebarSection title="Workspaces" workspaces={visibleWorkspaces} />

      <NewWorkspaceButton />

      <DirectMessagesSection directConversations={directConversations} />

      <NewMessageButton users={users} />
    </aside>
  );
}
