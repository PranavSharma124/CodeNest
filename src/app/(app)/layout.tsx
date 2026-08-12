import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardHeader from "@/features/app/header/DashboardHeader";
import Sidebar from "@/features/app/sidebar/Sidebar";
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
    <>
      <SocketConnection />
      <WorkspaceDeletionHandler />

      <DashboardHeader user={session.user} />

      <div className="flex">
        <Sidebar
          workspaces={workspaces}
          users={users}
          directConversations={directConversations}
        />

        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
