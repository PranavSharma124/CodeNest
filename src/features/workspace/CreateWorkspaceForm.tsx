"use client";
import { createWorkspace } from "@/actions/workspace";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function CreateWorkspaceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setLoading(true);

    try {
      const workspace = await createWorkspace(name);
      setName("");
      router.push(`/workspace/${workspace.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Enter Workspace Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating workspace..." : "Create Workspace"}
      </Button>
    </form>
  );
}
