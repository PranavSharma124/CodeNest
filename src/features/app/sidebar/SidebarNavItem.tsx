"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarNavItemProps = {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onNavigate?: () => void;
};

export default function SidebarNavItem({
  href,
  children,
  icon,
  onNavigate,
}: SidebarNavItemProps) {
  const pathname = usePathname();

  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      onClick={onNavigate}
      href={href}
      className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-green-500" />
      )}

      {icon}

      {children}
    </Link>
  );
}
