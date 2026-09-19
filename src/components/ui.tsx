import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-[var(--brass)] text-[var(--ink)] hover:brightness-105",
        variant === "secondary" &&
          "bg-[var(--ink)] text-[var(--sheet)] hover:bg-[var(--moss-deep)]",
        variant === "ghost" &&
          "text-[var(--mute)] hover:bg-[var(--sheet)] hover:text-[var(--ink)]",
        variant === "outline" &&
          "border border-[var(--rule)] text-[var(--ink)] hover:border-[var(--ink)]/40 hover:bg-[var(--sheet)]",
        variant === "danger" &&
          "border border-[var(--rust)]/25 text-[var(--rust)] hover:bg-[var(--rust)]/8",
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full border border-[var(--rule)] bg-[var(--sheet)] px-4 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--mute)]/50 focus:border-[var(--moss)] focus:ring-2 focus:ring-[var(--moss)]/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full border border-[var(--rule)] bg-[var(--sheet)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--mute)]/50 focus:border-[var(--moss)] focus:ring-2 focus:ring-[var(--moss)]/20",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm text-[var(--mute)]", className)}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border border-[var(--rule)] bg-[var(--sheet)] p-5 md:p-6",
        className,
      )}
      {...props}
    />
  );
}
