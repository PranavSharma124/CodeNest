import { Users } from "@/types/user";
import SidebarSection from "./SidebarSection";
import NewMessageButton from "./NewMessageButton";
import { DirectConversations } from "@/types/directConversation";
import DirectMessagesSection from "./DirectMessagesSection";
import NewWorkspaceButton from "./NewWorkspaceButton";

type WorkspaceItem = {
  id: string;
  name: string;
};

type SidebarProps = {
  workspaces: WorkspaceItem[];
  users: Users
  directConversations: DirectConversations
};

export default function Sidebar({ workspaces, users, directConversations }: SidebarProps) {
  return (
    <aside className="w-64 border p-4 space-y-6">
      <SidebarSection title="Workspaces" workspaces={workspaces} />
      <NewWorkspaceButton/>
      <DirectMessagesSection directConversations={directConversations}/>
      <NewMessageButton users={users} />
    </aside>
  );
}
