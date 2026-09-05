import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-full items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Welcome back, {session?.user.name}
        </h1>

        <p className="mt-3 text-muted-foreground">
          Ready to build something great?
        </p>
      </div>
    </div>
  );
}
