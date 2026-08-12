"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSocketIO } from "@/lib/socket-server";
import { revalidatePath } from "next/cache";

export async function leaveWorkspace(workspaceId: string) {
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

  if (membership.role === "OWNER") {
    throw new Error(
      "Workspace owners cannot leave. Delete the workspace instead.",
    );
  }

  await prisma.workspaceMember.delete({
    where: {
      id: membership.id,
    },
  });

  const io = getSocketIO();

  if (io) {
    io.to(`user:${session.user.id}`).emit("workspace-left", {
      workspaceId,
    });
  }

  revalidatePath("/", "layout");
}
