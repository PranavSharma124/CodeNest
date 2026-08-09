import Link from "next/link";
import { DirectConversations } from "@/types/directConversation";

type DirectConversationsProps = {
  directConversations: DirectConversations;
};

export default function DirectMessagesSection({
  directConversations,
}: DirectConversationsProps) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold">Direct Messages</h2>
      <ul className="space-y-1">
        {directConversations.map((conversation) => (
          <li key={conversation.id}>
            <Link href={`/DM/${conversation.id}`} className="block rounded-md px-2 py-1 hover:bg-muted">
              {conversation.user.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
