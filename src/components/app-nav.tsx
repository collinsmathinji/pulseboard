"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/app", label: "Overview" },
  { href: "/app/customers", label: "Customers" },
  { href: "/app/review", label: "Weekly review" },
  { href: "/app/integrations", label: "Integrations" },
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
    <aside className="flex w-full flex-col border-b border-[var(--sheet)]/12 bg-[var(--ink)] text-[var(--sheet)] lg:sticky lg:top-0 lg:h-svh lg:w-64 lg:border-r lg:border-b-0 lg:border-[var(--sheet)]/12">
      <div className="flex items-center justify-between px-5 py-5 lg:block">
        <Link href="/app" className="inline-flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            className="rounded"
          />
          <span className="font-serif text-[1.35rem] tracking-tight text-[var(--brass)]">
            Pulseboard
          </span>
        </Link>
        <p className="hidden truncate text-sm text-[var(--sheet)]/50 lg:mt-2 lg:block">
          {workspaceName}
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-4">
        {links.map((link) => {
          const active =
            link.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm whitespace-nowrap transition ${
                active
                  ? "bg-[var(--brass)] text-[var(--ink)]"
                  : "text-[var(--sheet)]/60 hover:bg-[var(--sheet)]/8 hover:text-[var(--sheet)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center justify-between gap-3 border-t border-[var(--sheet)]/12 px-4 py-4">
        <p className="truncate text-xs text-[var(--sheet)]/40">{email}</p>
        <button
          type="button"
          className="text-sm text-[var(--sheet)]/55 transition hover:text-[var(--sheet)]"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
