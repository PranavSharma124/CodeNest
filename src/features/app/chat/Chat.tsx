import { WorkspaceConversation } from "@/types/chat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

type ChatProps = {
  conversation: WorkspaceConversation;
};

export default function Chat({ conversation }: ChatProps) {
  return (
    <div className="flex h-full flex-col">
      <MessageList
        key={conversation.id}
        messages={conversation.messages}
        conversationId={conversation.id}
      />

      <MessageInput conversationId={conversation.id} />
    </div>
  );
}
