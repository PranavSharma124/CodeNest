import type { Server } from "socket.io";

const globalForSocket = globalThis as unknown as {
  io: Server | undefined;
};

export function setSocketIO(io: Server) {
  globalForSocket.io = io;
}

export function getSocketIO() {
  return globalForSocket.io;
}
