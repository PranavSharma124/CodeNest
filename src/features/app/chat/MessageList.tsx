import { WorkspaceMessage } from "@/types/chat";
import MessageItem from "./MessageItem";

type MessageListProps = {
  messages: WorkspaceMessage[];
};

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}
