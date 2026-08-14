import { getDirectConversation } from "@/actions/getDirectConversation";
import Chat from "@/features/app/chat/Chat";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Props = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function DMPage({ params }: Props) {
  const { conversationId } = await params;

  const conversation = await getDirectConversation(conversationId);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return <Chat conversation={conversation} currentUserId={session.user.id} />;
}
