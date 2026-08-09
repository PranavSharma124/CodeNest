import { Button } from "@/components/ui/button";
import { FolderGit2 } from "lucide-react";

export default function OpenSource() {
  return (
    <section className="py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <FolderGit2 className="mb-6 h-12 w-12 text-primary" />

        <h2 className="text-4xl font-bold tracking-tight">Built in the Open</h2>

        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          CodeNest is developed in public. Explore the source code, report
          issues, suggest new features, or contribute to the project as it
          grows.
        </p>

        <Button className="mt-8">View on GitHub</Button>
      </div>
    </section>
  );
}
