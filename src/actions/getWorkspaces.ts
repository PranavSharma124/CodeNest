"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getWorkspaces() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }
  const memberships = await prisma.workspaceMember.findMany({
    where: {
      userId: session.user.id,
    },

    include: {
      workspace: true,
    },
  });

  return memberships.map((membership) => membership.workspace);
}
