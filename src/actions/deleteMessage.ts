"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSocketIO } from "@/lib/socket-server";

export async function deleteMessage(messageId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
    },
  });

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.senderId !== session.user.id) {
    throw new Error("You can only delete your own messages");
  }

  const deletedMessage = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      isDeleted: true,
      content: "",
    },
    include: {
      sender: true,
    },
  });

  const io = getSocketIO();

  if (io) {
    io.to(`conversation:${deletedMessage.conversationId}`).emit(
      "message-deleted",
      deletedMessage,
    );
  }

  return deletedMessage;
}
