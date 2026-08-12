"use server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ConversationType } from "@prisma/client";

export async function getWorkspaceChat(workspaceId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspaceId,
    },
    include: {
      workspace: {
        include: {
          conversations: {
            where: {
              type: ConversationType.WORKSPACE,
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
          },
        },
      },
    },
  });

  if (!membership) {
    throw new Error("Workspace not found");
  }

  return {
    ...membership.workspace,
    role: membership.role,
  };
}
