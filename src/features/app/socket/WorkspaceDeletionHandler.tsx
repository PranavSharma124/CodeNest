"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";

export default function WorkspaceDeletionHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleWorkspaceDeleted = ({
      workspaceId,
    }: {
      workspaceId: string;
    }) => {
      console.log("Workspace deleted:", workspaceId);

      const workspacePath = `/workspace/${workspaceId}`;

      if (pathname === workspacePath) {
        router.push("/dashboard");
      } else {
        router.refresh();
      }
    };

    socket.on("workspace-deleted", handleWorkspaceDeleted);

    return () => {
      socket.off("workspace-deleted", handleWorkspaceDeleted);
    };
  }, [pathname, router]);

  return null;
}