import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PortalCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-svh bg-[#16081f] text-white", className)}>
      {children}
    </div>
  );
}

export function StandaloneCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <PortalCanvas className="flex items-center justify-center px-6 py-12">
      <div className={cn("w-full max-w-lg", className)}>{children}</div>
    </PortalCanvas>
  );
}

export function PageKicker({ children }: { children: ReactNode }) {
  return <p className="text-sm text-[#e8b44d]">{children}</p>;
}

export function PageTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "mt-2 font-sans text-4xl leading-[0.95] font-black tracking-tight text-white md:text-5xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function PathToFive({ count }: { count: number }) {
  const n = Math.min(5, Math.max(0, count));
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-white/55">Path to five paying users</p>
        <p className="font-mono text-sm text-[#e8b44d]">{n} / 5</p>
      </div>
      <div className="mt-3 flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              i < n ? "bg-[#e8b44d]" : "bg-white/10",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function formatWeekStamp(date = new Date()) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export function isoWeek(date = new Date()) {
  const t = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function formatDelta(cents: number) {
  const sign = cents > 0 ? "+" : "";
  return `${sign}${(cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  })}`;
}
