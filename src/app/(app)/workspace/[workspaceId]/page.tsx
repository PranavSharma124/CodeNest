import { getWorkspaceChat } from "@/actions/getWorkspaceChat";
import Chat from "@/features/app/chat/Chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Props = {
  params: Promise<{
    workspaceId: string;
  }>;
};

export default async function WorkspacePage({ params }: Props) {
  const { workspaceId } = await params;

  const workspace = await getWorkspaceChat(workspaceId);

  const conversation = workspace.conversations[0];

  if (!conversation) {
    return <div>No workspace conversation found.</div>;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return (
    <div>
      <Chat
        conversation={conversation}
        workspace={workspace}
        currentUserId={session.user.id}
      />
    </div>
  );
}
