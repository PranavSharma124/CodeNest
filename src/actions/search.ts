"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function searchApp(query: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      users: [],
      workspaces: [],
      directMessages: [],
    };
  }

  const [users, workspaces, directMessages] = await Promise.all([
    // People
    prisma.user.findMany({
      where: {
        id: {
          not: session.user.id,
        },
        OR: [
          {
            name: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      take: 5,
    }),

    // Workspaces the current user belongs to
    prisma.workspace.findMany({
      where: {
        name: {
          contains: trimmedQuery,
          mode: "insensitive",
        },
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 5,
    }),

    // Existing direct conversations
    prisma.conversation.findMany({
      where: {
        type: "DIRECT",
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        participants: {
          where: {
            userId: {
              not: session.user.id,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      take: 20,
    }),
  ]);

  const filteredDirectMessages = directMessages
    .map((conversation) => {
      const otherParticipant = conversation.participants[0];

      if (!otherParticipant) {
        return null;
      }

      const user = otherParticipant.user;

      const matches = user.name
        .toLowerCase()
        .includes(trimmedQuery.toLowerCase());

      if (!matches) {
        return null;
      }

      return {
        id: conversation.id,
        user,
      };
    })
    .filter((conversation) => conversation !== null)
    .slice(0, 5);

  return {
    users,
    workspaces,
    directMessages: filteredDirectMessages,
  };
}
