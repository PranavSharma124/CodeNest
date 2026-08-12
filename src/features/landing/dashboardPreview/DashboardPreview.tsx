import ChatPanel from "../../app/chat/ChatPanel/ChatPanel";
import DashboardHeader from "../../app/header/DashboardHeader";
import Sidebar from "../../app/sidebar/Sidebar";

const workspaces = [
  {
    id: "1",
    name: "CodeNest",
  },
  {
    id: "2",
    name: "API Service",
  },
  {
    id: "3",
    name: "Landing Page",
  },
];

const users = [
  {
    id: "1",
    name: "Alex",
    image: null,
  },
  {
    id: "2",
    name: "Sarah",
    image: null,
  },
];

const directConversations = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Alex",
      image: null,
    },
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "Sarah",
      image: null,
    },
  },
];

export default function DashboardPreview() {
  return (
    <section>
      <DashboardHeader
        user={{
          name: "Demo User",
          email: "demo@example.com",
          image: null,
        }}
      />
      <div className="flex">
        <Sidebar
          workspaces={workspaces}
          users={users}
          directConversations={directConversations}
        />

        <ChatPanel />
      </div>
    </section>
  );
}
