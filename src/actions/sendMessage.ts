"use server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function sendMessage(conversationId: string, content: string) {
  if (!content.trim()) {
    throw new Error("Message cannot be empty");
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,

      OR: [
        {
          workspace: {
            members: {
              some: {
                userId: session.user.id,
              },
            },
          },
        },

        {
          participants: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    },
  });

  if (!conversation) {
    throw new Error("Unauthorized");
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: session.user.id,
      content,
    },
    include: {
      sender: true,
    },
  });

  return message;
}
