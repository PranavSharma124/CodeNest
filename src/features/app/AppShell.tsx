"use client";

import { useState } from "react";
import DashboardHeader from "./header/DashboardHeader";
import Sidebar from "./sidebar/Sidebar";
import { Users } from "@/types/user";
import { DirectConversations } from "@/types/directConversation";

type WorkspaceItem = {
  id: string;
  name: string;
};

type AppShellProps = {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  workspaces: WorkspaceItem[];
  users: Users;
  directConversations: DirectConversations;
};

export default function AppShell({
  children,
  user,
  workspaces,
  users,
  directConversations,
}: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DashboardHeader
        user={user}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          workspaces={workspaces}
          users={users}
          directConversations={directConversations}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
