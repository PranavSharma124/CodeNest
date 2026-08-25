import Link from "next/link";
import { DirectConversations } from "@/types/directConversation";

type DirectConversationsProps = {
  directConversations: DirectConversations;
  onNavigate?: () => void;
};

export default function DirectMessagesSection({
  directConversations,
  onNavigate,
}: DirectConversationsProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <h2 className="shrink-0 px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        Direct Messages
      </h2>

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {directConversations.map((conversation) => (
          <li key={conversation.id}>
            <Link
              href={`/DM/${conversation.id}`}
              onClick={onNavigate}
              className="block rounded-md px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {conversation.user.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
