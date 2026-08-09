import { getDirectConversations } from "@/actions/getDirectConversations";

export type DirectConversations = Awaited<
  ReturnType<typeof getDirectConversations>
>;