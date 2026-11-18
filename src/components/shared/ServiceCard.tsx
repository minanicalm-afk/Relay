import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/data";
import { Icon } from "@/components/ui/Icon";

export function ServiceCard({
  service,
  featured = false,
}: {
  service: Service;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-7 ${
        featured
          ? "border-lime-400/40 bg-forest-900 text-white"
          : "border-forest-100 bg-white shadow-card hover:border-forest-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`grid h-12 w-12 place-items-center rounded-2xl transition ${
            featured
              ? "bg-lime-500 text-forest-950"
              : "bg-forest-50 text-forest-700 group-hover:bg-forest-100"
          }`}
        >
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <ArrowUpRight
          className={`h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
            featured ? "text-lime-400" : "text-forest-300 group-hover:text-forest-700"
          }`}
        />
      </div>

      <h3
        className={`mt-6 text-xl font-semibold ${
          featured ? "text-white" : "text-forest-950"
        }`}
      >
        {service.title}
      </h3>
      <p
        className={`mt-3 flex-1 text-sm leading-relaxed ${
          featured ? "text-forest-100/70" : "text-forest-900/75"
        }`}
      >
        {service.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {service.highlights.slice(0, 2).map((item) => (
          <span
            key={item}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              featured
                ? "bg-white/10 text-forest-100/80"
                : "bg-forest-50 text-forest-700"
            }`}
          >
            {item}
          </span>
        ))}
      </div>

      {featured && (
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-lime-400">
          Our flagship service <ArrowUpRight className="h-4 w-4" />
        </span>
      )}
    </Link>
  );
}
