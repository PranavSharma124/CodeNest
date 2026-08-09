import { WorkspaceMessage } from "@/types/chat";

type MessageItemProps = {
  message: WorkspaceMessage;
};

export default function MessageItem({ message }: MessageItemProps) {
  return (
    <div>
      <strong>{message.sender.name}</strong>
      <p>{message.content}</p>
    </div>
  );
}
