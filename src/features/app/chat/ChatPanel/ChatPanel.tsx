import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import MessageInput from "./MessageInput";

const messages = [
  {
    id: 1,
    sender: "Alex",
    text: "Let's deploy tonight.",
  },
  {
    id: 2,
    sender: "You",
    text: "I'll finish the landing page.",
  },
  {
    id: 3,
    sender: "Sarah",
    text: "The auth flow is done.",
  },
];

export default function ChatPanel() {
  return (
    <section className="flex-1 flex flex-col">
      <ChatHeader />
      <Messages messages={messages} />
      <MessageInput />
    </section>
  );
}
