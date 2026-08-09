"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConversationType } from "@prisma/client";

export async function getDirectConversation(conversationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const directConversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      type: ConversationType.DIRECT,
      participants: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      messages: {
        include: {
          sender: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!directConversation) {
    throw new Error("Direct Message not found");
  }

  return directConversation;
}
