import { getWorkspaceChat } from "@/actions/getWorkspaceChat";

export type WorkspaceChat= Awaited<ReturnType<typeof getWorkspaceChat>>

export type WorkspaceConversation= WorkspaceChat["conversations"][number]

export type WorkspaceMessage = WorkspaceConversation["messages"][number];

