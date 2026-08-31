"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getWorkspaceMembers(workspaceId: string) {
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

  const members = await prisma.$queryRaw<
    Array<{
      id: string;
      role: "OWNER" | "ADMIN" | "MEMBER";
      userId: string;
      userName: string;
      userEmail: string;
      userImage: string | null;
    }>
  >`
  SELECT
    wm.id,
    wm.role,
    u.id AS "userId",
    u.name AS "userName",
    u.email AS "userEmail",
    u.image AS "userImage"
  FROM "workspace_member" AS wm
  INNER JOIN "user" AS u
    ON wm."userId" = u.id
  WHERE wm."workspaceId" = ${workspaceId}
  ORDER BY wm."createdAt" ASC
`;

  return members.map((member) => ({
    id: member.id,
    role: member.role,
    user: {
      id: member.userId,
      name: member.userName,
      email: member.userEmail,
      image: member.userImage,
    },
  }));
}
