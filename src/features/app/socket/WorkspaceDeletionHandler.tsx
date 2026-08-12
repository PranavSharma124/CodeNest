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

      if (pathname === `/workspace/${workspaceId}`) {
        router.push("/dashboard");
      } else {
        router.refresh();
      }
    };

    const handleWorkspaceLeft = ({ workspaceId }: { workspaceId: string }) => {
      console.log("Left workspace:", workspaceId);

      if (pathname === `/workspace/${workspaceId}`) {
        router.push("/dashboard");
      } else {
        router.refresh();
      }
    };

    socket.on("workspace-deleted", handleWorkspaceDeleted);
    socket.on("workspace-left", handleWorkspaceLeft);

    return () => {
      socket.off("workspace-deleted", handleWorkspaceDeleted);
      socket.off("workspace-left", handleWorkspaceLeft);
    };
  }, [pathname, router]);

  return null;
}
