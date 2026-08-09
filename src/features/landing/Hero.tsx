import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-10 py-20">
      <h1 className="font-bold text-6xl tracking-tight py-5">
        Collaborate. Build. Ship Faster.
      </h1>

      <p className="max-w-3xl text-center py-5">
        CodeNest brings messaging, project workspaces, and developer
        collaboration into one modern platform, helping teams stay organized and
        ship software together.
      </p>

      <div className="flex items-center gap-4">
        <Link href="/signup">
          <Button>Get Started</Button>
        </Link>
        <a
          href="https://github.com/your-username/codenest"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button>View GitHub</Button>
        </a>
      </div>
    </section>
  );
}
