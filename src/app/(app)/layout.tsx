import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AppShell from "@/features/app/AppShell";

import { getWorkspaces } from "@/actions/getWorkspaces";
import { getUsers } from "@/actions/getUsers";
import { getDirectConversations } from "@/actions/getDirectConversations";
import SocketConnection from "@/features/app/socket/SocketConnection";
import WorkspaceDeletionHandler from "@/features/app/socket/WorkspaceDeletionHandler";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const workspaces = await getWorkspaces();
  const users = await getUsers();
  const directConversations = await getDirectConversations();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SocketConnection />
      <WorkspaceDeletionHandler />

      <AppShell
        user={session.user}
        workspaces={workspaces}
        users={users}
        directConversations={directConversations}
      >
        {children}
      </AppShell>
    </div>
  );
}
