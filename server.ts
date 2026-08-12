import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { setSocketIO } from "@/lib/socket-server";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./src/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConversationType } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = Number(process.env.PORT) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer);

  setSocketIO(io);

  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.handshake.headers),
      });

      if (!session) {
        return next(new Error("Unauthorized"));
      }

      socket.data.userId = session.user.id;

      next();
    } catch (error) {
      console.error("Socket authentication failed:", error);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);

    socket.on("join-conversation", async (conversationId: string) => {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [
            {
              type: ConversationType.DIRECT,
              participants: {
                some: {
                  userId,
                },
              },
            },
            {
              type: ConversationType.WORKSPACE,
              workspace: {
                members: {
                  some: {
                    userId,
                  },
                },
              },
            },
          ],
        },
      });

      if (!conversation) {
        console.log(
          `User ${userId} attempted unauthorized conversation: ${conversationId}`,
        );

        return;
      }

      socket.join(`conversation:${conversationId}`);
    });

    socket.on("disconnect", () => {});
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
