"use client";

import { useEffect, useRef, useState } from "react";

function parseStat(value: string) {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return { target: 0, suffix: "" };
  return {
    target: Number(match[1].replace(/,/g, "")),
    suffix: match[2],
  };
}

export function CountUp({
  value,
  delay = 0,
}: {
  value: string;
  delay?: number;
}) {
  const { target, suffix } = parseStat(value);
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setCurrent(target);
      return;
    }

    let frame = 0;
    let timeout = 0;
    let running = false;
    let cancelled = false;

    const run = () => {
      if (cancelled || running) return;
      running = true;
      const duration = 1600;
      let origin = 0;

      const tick = (now: number) => {
        if (cancelled) return;
        if (!origin) origin = now;
        const progress = Math.min(1, (now - origin) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(progress === 1 ? target : Math.round(target * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };

      timeout = window.setTimeout(() => {
        frame = requestAnimationFrame(tick);
      }, delay);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [target, delay]);

  return (
    <span ref={ref} aria-label={value}>
      {current.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
