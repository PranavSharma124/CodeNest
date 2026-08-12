import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div>
      <h2>Welcome Back {session?.user.name}</h2>
    </div>
  );
}
