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
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" &&
          "bg-[#e8b44d] text-[#16081f] hover:bg-[#f0c15a]",
        variant === "secondary" &&
          "bg-white/10 text-white hover:bg-white/16",
        variant === "ghost" && "text-white/70 hover:bg-white/8",
        variant === "outline" &&
          "border border-white/15 text-white hover:bg-white/8",
        variant === "danger" &&
          "bg-red-500/15 text-red-300 hover:bg-red-500/25",
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
        "h-11 w-full rounded-full border border-white/10 bg-[#110814] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#e8b44d]/60 focus:ring-2 focus:ring-[#e8b44d]/20",
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
        "min-h-24 w-full rounded-2xl border border-white/10 bg-[#110814] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#e8b44d]/60 focus:ring-2 focus:ring-[#e8b44d]/20",
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
      className={cn("mb-1.5 block text-sm text-white/55", className)}
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
        "rounded-[28px] bg-white/5 p-5",
        className,
      )}
      {...props}
    />
  );
}
