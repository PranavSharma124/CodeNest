import { getDirectConversation } from "@/actions/getDirectConversation";
import Chat from "@/features/app/chat/Chat";

type Props = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function DMPage({ params }: Props) {
  const { conversationId } = await params;
  const conversation = await getDirectConversation(conversationId);

  return <Chat conversation={conversation} />;
}
