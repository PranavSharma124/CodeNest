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
import SidebarNavItem from "./SidebarNavItem";
import { Bot } from "lucide-react";

type WorkspaceItem = {
  id: string;
  name: string;
};

type SidebarProps = {
  workspaces: WorkspaceItem[];
  users: Users;
  directConversations: DirectConversations;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export default function Sidebar({
  workspaces,
  users,
  directConversations,
  mobileOpen = false,
  onMobileClose,
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
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`
    fixed inset-y-0 left-0 z-50
    flex w-72 shrink-0 flex-col gap-3
    border-r border-sidebar-border
    bg-sidebar p-3 text-sidebar-foreground
    transition-transform duration-200
    md:static md:z-auto md:w-64 md:translate-x-0
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        <SidebarSection
          title="Workspaces"
          workspaces={visibleWorkspaces}
          onNavigate={onMobileClose}
        />

        <NewWorkspaceButton />

        <DirectMessagesSection
          directConversations={directConversations}
          onNavigate={onMobileClose}
        />

        <NewMessageButton users={users} />

        <SidebarNavItem
          href="/ai"
          icon={<Bot className="h-4 w-4" />}
          onNavigate={onMobileClose}
        >
          CodeNest AI
        </SidebarNavItem>
      </aside>
    </>
  );
}
