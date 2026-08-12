"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { WorkspaceRole, ConversationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createWorkspace(name: string) {
  if (!name.trim()) {
    throw new Error("Workspace name is required.");
  }
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const createdWorkspace = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: { name },
    });

    await tx.conversation.create({
      data: {
        type: ConversationType.WORKSPACE,
        workspaceId: workspace.id,
      },
    });

    await tx.workspaceMember.create({
      data: {
        userId: session.user.id,
        workspaceId: workspace.id,
        role: WorkspaceRole.OWNER,
      },
    });

    return workspace;
  });

  revalidatePath("/", "layout");

  return createdWorkspace;
}
