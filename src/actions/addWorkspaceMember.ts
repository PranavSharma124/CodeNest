"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSocketIO } from "@/lib/socket-server";

export async function addWorkspaceMember(workspaceId: string, userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: session.user.id,
      role: {
        in: ["OWNER", "ADMIN"],
      },
    },
  });

  if (!membership) {
    throw new Error("You do not have permission to add members");
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExists) {
    throw new Error("User not found");
  }

  const alreadyMember = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  if (alreadyMember) {
    throw new Error("User is already a member of this workspace");
  }

  const newMember = await prisma.workspaceMember.create({
    data: {
      userId,
      workspaceId,
      role: "MEMBER",
    },
  });

  const io = getSocketIO();

  if (io) {
    io.to(`user:${userId}`).emit("workspace-added");
  }

  return newMember;
}
