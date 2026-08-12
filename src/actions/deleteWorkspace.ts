"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSocketIO } from "@/lib/socket-server";

export async function deleteWorkspace(workspaceId: string) {
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
    },
  });

  if (!membership) {
    throw new Error("You are not a member of this workspace");
  }

  if (membership.role !== "OWNER") {
    throw new Error("Only the workspace owner can delete the workspace");
  }

  const members = await prisma.workspaceMember.findMany({
    where: {
      workspaceId,
    },
    select: {
      userId: true,
    },
  });

  await prisma.workspace.delete({
    where: {
      id: workspaceId,
    },
  });

  const io = getSocketIO();

  if (io) {
    for (const member of members) {
      io.to(`user:${member.userId}`).emit("workspace-deleted", {
        workspaceId,
      });
    }
  }

  revalidatePath("/", "layout");
}