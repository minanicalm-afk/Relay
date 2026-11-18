import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

const DEFAULT_HERO_IMAGE = "/images/hero-recycling.jpeg";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  lede,
  children,
  className,
  align = "left",
  image = DEFAULT_HERO_IMAGE,
  imageAlt = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  lede?: string;
  breadcrumb?: { label: string; href?: string }[];
  children?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section
      className={cn(
        "relative flex h-[48rem] items-start overflow-hidden bg-forest-950 py-16 text-white lg:h-[42rem]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-1/2">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/90 to-transparent lg:via-forest-950/30" />
      </div>

      <Container className="relative z-10">
        {breadcrumb && (
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-medium text-forest-100/75"
          >
            <Link href="/" className="hover:text-lime-300">
              Home
            </Link>
            {breadcrumb.map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-lime-300">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-forest-100/90">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className={cn("max-w-2xl", align === "center" && "mx-auto max-w-3xl text-center")}>
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {lede && (
            <p className="mt-5 text-lg font-medium text-lime-300">{lede}</p>
          )}
          {description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-forest-100/75 sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
