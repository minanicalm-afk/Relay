"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setCurrent(target);
      return;
    }

    let frame = 0;
    const duration = 1600;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const timeout = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [target, delay]);

  return (
    <span aria-label={value}>
      {current.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
