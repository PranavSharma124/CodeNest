"use client";

import { useState } from "react";
import { deleteWorkspace } from "@/actions/deleteWorkspace";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

type DeleteWorkspaceDialogProps = {
  workspaceId: string;
  workspaceName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteWorkspaceDialog({
  workspaceId,
  workspaceName,
  open,
  onOpenChange,
}: DeleteWorkspaceDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteWorkspace(workspaceId);

      onOpenChange(false);

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete workspace?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{workspaceName}</span>
            ?
          </p>

          <p className="text-sm text-destructive">
            This action cannot be undone. The workspace and its conversations
            will be deleted.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Workspace"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
