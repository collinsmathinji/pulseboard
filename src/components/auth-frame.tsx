import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand";
import { cn } from "@/lib/utils";

export const AUTH_STEPS = [
  {
    n: "01",
    title: "Create an account",
    body: "Name + work email. Thirty seconds.",
  },
  {
    n: "02",
    title: "Pick a plan",
    body: "$12 a month, or $99 for the founding year.",
  },
  {
    n: "03",
    title: "Write the week",
    body: "MRR, paying users, runway, three priorities.",
  },
] as const;

export function AuthFrame({
  kicker,
  title,
  body,
  step,
  aside,
  footer,
  formKicker,
  formTitle,
  formBody,
  wide,
  children,
}: {
  kicker: string;
  title: ReactNode;
  body: string;
  step?: 1 | 2 | 3;
  aside?: ReactNode;
  footer?: ReactNode;
  formKicker?: string;
  formTitle?: string;
  formBody?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="auth-shell min-h-svh md:grid md:grid-cols-2">
      <section className="relative flex flex-col justify-between overflow-hidden bg-[var(--ink)] px-6 py-8 text-[var(--sheet)] md:min-h-svh md:px-10 md:py-10">
        <div className="auth-grain" aria-hidden />
        <BrandMark className="relative" />
        <div className="auth-rise relative py-12 md:py-0">
          <p className="font-hand text-xl text-[var(--brass)] md:text-2xl">
            {kicker}
          </p>
          <span
            className="landing-underline mt-3 block h-px w-14 bg-[var(--brass)]"
            aria-hidden
          />
          <h1 className="mt-6 max-w-sm font-sans text-4xl leading-[0.95] font-black tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--sheet)]/65">
            {body}
          </p>
          {aside}
          {step ? (
            <ol className="mt-10 space-y-5">
              {AUTH_STEPS.map((item, i) => {
                const active = i + 1 === step;
                return (
                  <li
                    key={item.n}
                    className={cn(
                      "grid grid-cols-[auto_1fr] gap-3 transition",
                      active ? "opacity-100" : "opacity-40",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-sm",
                        active ? "text-[var(--brass)]" : "text-[var(--sheet)]/55",
                      )}
                    >
                      {item.n}
                    </span>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-[var(--sheet)]/50">
                        {item.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </div>
        {footer ? (
          <p className="relative mt-8 hidden text-sm text-[var(--sheet)]/40 md:block">
            {footer}
          </p>
        ) : (
          <span className="hidden md:block" />
        )}
      </section>

      <section className="flex items-center bg-[var(--paper)] px-6 py-12 text-[var(--ink)] md:px-12">
        <div
          className={cn(
            "auth-rise mx-auto w-full",
            wide ? "max-w-2xl" : "max-w-md",
          )}
          style={{ animationDelay: "90ms" }}
        >
          {formKicker ? (
            <p className="font-hand text-xl text-[var(--moss)]">{formKicker}</p>
          ) : null}
          {formTitle ? (
            <h2 className="mt-3 font-sans text-3xl leading-[0.95] font-black tracking-tight">
              {formTitle}
            </h2>
          ) : null}
          {formBody ? (
            <p className="mt-3 text-sm leading-7 text-[var(--mute)]">
              {formBody}
            </p>
          ) : null}
          {children}
        </div>
      </section>
    </div>
  );
}
