import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em]",
        tone === "light"
          ? "bg-forest-100 text-forest-700"
          : "bg-white/10 text-lime-300 ring-1 ring-inset ring-white/15",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "light" ? "bg-forest-500" : "bg-lime-400")} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "mt-5 text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[3rem]",
          tone === "dark" ? "text-white" : "text-forest-950",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-forest-100/80" : "text-forest-900/80",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
