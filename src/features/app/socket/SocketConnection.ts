"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function SocketConnection() {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
