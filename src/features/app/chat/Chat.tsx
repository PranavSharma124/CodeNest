import { WorkspaceConversation } from "@/types/chat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatPanel/ChatHeader";

type ChatProps = {
  conversation: WorkspaceConversation;
  workspace?: {
    id: string;
    name: string;
  };
};

export default function Chat({ conversation, workspace }: ChatProps) {
  return (
    <div className="flex h-full flex-col">
      <ChatHeader workspace={workspace} />

      <MessageList
        key={conversation.id}
        messages={conversation.messages}
        conversationId={conversation.id}
      />

      <MessageInput conversationId={conversation.id} />
    </div>
  );
}
