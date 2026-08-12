"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAddableWorkspaceUsers(workspaceId: string) {
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

  const existingMembers = await prisma.workspaceMember.findMany({
    where: {
      workspaceId,
    },
    select: {
      userId: true,
    },
  });

  const existingMemberIds = existingMembers.map((member) => member.userId);

  const users = await prisma.user.findMany({
    where: {
      id: {
        notIn: existingMemberIds,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return users;
}
