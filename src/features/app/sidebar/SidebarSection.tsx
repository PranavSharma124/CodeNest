import Link from "next/link";

type WorkspaceItem = {
  id: string;
  name: string;
};

type SidebarSectionProps = {
  title: string;
  workspaces: WorkspaceItem[];
  onNavigate?: () => void;
};

export default function SidebarSection({
  title,
  workspaces,
  onNavigate,
}: SidebarSectionProps) {
  return (
    <section className="flex min-h-0 max-h-[30%] flex-col">
      <h2 className="shrink-0 px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        {title}
      </h2>

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {workspaces.map((workspace) => (
          <li key={workspace.id}>
            <Link
              href={`/workspace/${workspace.id}`}
              onClick={onNavigate}
              className="block rounded-md px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {workspace.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
