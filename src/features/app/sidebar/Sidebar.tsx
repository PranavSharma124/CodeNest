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
import Link from "next/link";
import { Bot } from "lucide-react";

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
  const [hiddenWorkspaceIds, setHiddenWorkspaceIds] = useState<Set<string>>(
    new Set(),
  );

  const visibleWorkspaces = workspaces.filter(
    (workspace) => !hiddenWorkspaceIds.has(workspace.id),
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

      setHiddenWorkspaceIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(workspaceId);
        return nextIds;
      });
    };

    const handleWorkspaceLeft = ({ workspaceId }: { workspaceId: string }) => {
      console.log("Removing left workspace from sidebar:", workspaceId);

      setHiddenWorkspaceIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(workspaceId);
        return nextIds;
      });
    };

    socket.on("workspace-added", handleWorkspaceAdded);
    socket.on("workspace-deleted", handleWorkspaceDeleted);
    socket.on("workspace-left", handleWorkspaceLeft);

    return () => {
      socket.off("workspace-added", handleWorkspaceAdded);
      socket.off("workspace-deleted", handleWorkspaceDeleted);
      socket.off("workspace-left", handleWorkspaceLeft);
    };
  }, [router]);

  return (
    <aside className="w-64 border p-4 space-y-6">
      <SidebarSection title="Workspaces" workspaces={visibleWorkspaces} />

      <NewWorkspaceButton />

      <DirectMessagesSection directConversations={directConversations} />

      <NewMessageButton users={users} />

      <Link
        href="/ai"
        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        <Bot className="h-4 w-4" />
        CodeNest AI
      </Link>
    </aside>
  );
}
