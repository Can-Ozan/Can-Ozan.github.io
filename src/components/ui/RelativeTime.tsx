"use client";
import { useEffect, useState } from "react";
import { formatDate, relativeTime } from "@/lib/github/helpers";

export function RelativeTime({ date, now }: { date: string; now: string }) {
  const [clock, setClock] = useState(Date.parse(now));
  useEffect(() => {
    const refresh = () => setClock(Date.now());
    const frame = requestAnimationFrame(refresh);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, []);
  return (
    <time dateTime={date} title={formatDate(date)}>
      {relativeTime(date, clock)}
    </time>
  );
}
