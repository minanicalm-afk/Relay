import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-forest-800 shadow-card ring-1 ring-white/10">
        <svg
          viewBox="0 0 32 32"
          className="h-6 w-6 text-lime-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M26 6C14 6 7 10 7 19c0 4 2 6 6 6 9 0 13-7 13-19Z" />
          <path d="M9 22c3-5 7-8 12-10" />
          <circle cx="20" cy="9" r="1.6" fill="currentColor" stroke="none" />
        </svg>
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-lime-400 ring-2 ring-white" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl font-bold tracking-tight",
            light ? "text-white" : "text-forest-950",
          )}
        >
          Re<span className="text-forest-500">lay</span>
        </span>
        <span
          className={cn(
            "mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em]",
            light ? "text-lime-300/80" : "text-forest-700",
          )}
        >
          Reuse · Restore · Impact
        </span>
      </span>
    </Link>
  );
}
