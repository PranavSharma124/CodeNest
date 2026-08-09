import Link from "next/link";

type WorkspaceItem = {
  id: string;
  name: string;
};

type SidebarSectionProps = {
  title: string;
  workspaces: WorkspaceItem[];
};

export default function SidebarSection({
  title,
  workspaces,
}: SidebarSectionProps) {
  return (
    <section className="mb-6 space-y-2">
      <h2 className="font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>

      <ul className="space-y-1">
        {workspaces.map((workspace) => (
          <li key={workspace.id}>
            <Link href={`/workspace/${workspace.id}`} className="block rounded-md px-2 py-1 hover:bg-muted">
              {workspace.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
