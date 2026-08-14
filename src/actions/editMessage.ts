"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSocketIO } from "@/lib/socket-server";

export async function editMessage(messageId: string, content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error("Message cannot be empty");
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
    throw new Error("You can only edit your own messages");
  }

  const updatedMessage = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      content: trimmedContent,
    },
    include: {
      sender: true,
    },
  });

  const io = getSocketIO();

  if (io) {
    io.to(`conversation:${updatedMessage.conversationId}`).emit(
      "message-updated",
      updatedMessage,
    );
  }

  return updatedMessage;
}
