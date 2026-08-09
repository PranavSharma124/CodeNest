"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConversationType } from "@prisma/client";

export async function getConversation(workspaceId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      workspaceId,
      type: ConversationType.WORKSPACE,

      workspace: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return conversation;
}
