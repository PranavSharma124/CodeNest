import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  id: number;
  sender: string;
  text: string;
};

type MessagesProps = {
  messages: Message[];
};

export default function Messages({ messages }: MessagesProps) {
  return (
    <div className="flex-1 space-y-10 p-6">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{message.sender[0]}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h4 className="font-medium">{message.sender}</h4>
            <p className="text-sm text-muted-foreground">{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
