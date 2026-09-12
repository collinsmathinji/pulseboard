"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";

const links = [
  { href: "/app", label: "Overview" },
  { href: "/app/customers", label: "Customers" },
  { href: "/app/review", label: "Weekly review" },
  { href: "/billing", label: "Billing" },
];

export function AppNav({
  workspaceName,
  email,
}: {
  workspaceName: string;
  email?: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-zinc-800 bg-zinc-950 lg:h-screen lg:w-60 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-4 lg:block">
        <Link href="/app" className="font-serif text-xl text-amber-300">
          Pulseboard
        </Link>
        <p className="hidden text-sm text-zinc-500 lg:mt-1 lg:block">
          {workspaceName}
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
        {links.map((link) => {
          const active =
            link.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm whitespace-nowrap ${
                active
                  ? "bg-zinc-800 text-zinc-50"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center justify-between gap-3 border-t border-zinc-800 px-4 py-3">
        <p className="truncate text-xs text-zinc-500">{email}</p>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </Button>
      </div>
    </aside>
  );
}
