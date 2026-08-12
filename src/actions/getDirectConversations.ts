"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConversationType } from "@prisma/client";

export async function getDirectConversations() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const directConversations = await prisma.conversation.findMany({
    where: {
      type: ConversationType.DIRECT,
      participants: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const sidebarConversations = directConversations
    .map((conversation) => {
      const otherParticipant = conversation.participants.find(
        (participant) => participant.userId !== session.user.id,
      );

      if (!otherParticipant) {
        return null;
      }

      return {
        id: conversation.id,
        user: otherParticipant.user,
      };
    })
    .filter((conversation) => conversation !== null);

  return sidebarConversations;
}
