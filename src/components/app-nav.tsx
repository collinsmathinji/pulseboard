"use client";

import Image from "next/image";
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
    <aside className="flex w-full flex-col border-b border-white/8 bg-[#16081f] lg:sticky lg:top-0 lg:h-svh lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between px-5 py-5 lg:block">
        <Link href="/app" className="inline-flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Pulseboard"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-serif text-xl text-[#e8b44d]">pulseboard</span>
        </Link>
        <p className="hidden truncate text-sm text-white/45 lg:mt-2 lg:block">
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
              className={`rounded-full px-3 py-2 text-sm whitespace-nowrap ${
                active
                  ? "bg-[#e8b44d] text-[#16081f]"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center justify-between gap-3 border-t border-white/8 px-4 py-4">
        <p className="truncate text-xs text-white/40">{email}</p>
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
