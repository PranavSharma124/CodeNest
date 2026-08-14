import { WorkspaceConversation } from "@/types/chat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatPanel/ChatHeader";

type ChatProps = {
  conversation: WorkspaceConversation;
  currentUserId: string;
  workspace?: {
    id: string;
    name: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
  };
};

export default function Chat({
  conversation,
  currentUserId,
  workspace,
}: ChatProps) {
  return (
    <div className="flex h-full flex-col">
      <ChatHeader workspace={workspace} />

      <MessageList
        key={conversation.id}
        messages={conversation.messages}
        conversationId={conversation.id}
        currentUserId={currentUserId}
      />

      <MessageInput conversationId={conversation.id} />
    </div>
  );
}
