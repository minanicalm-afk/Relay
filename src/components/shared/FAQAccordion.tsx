"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQAccordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-forest-100 overflow-hidden rounded-3xl border border-forest-100 bg-white shadow-card">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-forest-50/60 sm:px-8"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-forest-950">{item.q}</span>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full transition",
                  isOpen ? "rotate-45 bg-forest-800 text-lime-400" : "bg-forest-50 text-forest-700",
                )}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-relaxed text-forest-900/80 sm:px-8">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
