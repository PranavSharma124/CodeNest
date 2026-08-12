import { getWorkspaceChat } from "@/actions/getWorkspaceChat";
import Chat from "@/features/app/chat/Chat";

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

  return (
    <div>
      <Chat conversation={conversation} workspace={workspace} />
    </div>
  );
}
