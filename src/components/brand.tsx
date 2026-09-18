import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  href = "/",
  size = 32,
  className,
}: {
  href?: string;
  size?: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <Image
        src="/logo.png"
        alt="Pulseboard"
        width={size}
        height={size}
        className="rounded-lg"
        priority
      />
      <span className="font-serif text-2xl text-[#b8922a]">Pulseboard</span>
    </Link>
  );
}
