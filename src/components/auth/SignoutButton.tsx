"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignoutButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      if (loading) return;
      setLoading(true);

      const result = await authClient.signOut();

      if (result.error) {
        console.error(result.error.message);
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
