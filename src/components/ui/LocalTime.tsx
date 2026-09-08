"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/siteConfig";

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: siteConfig.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const update = () => {
      if (!document.hidden) setTime(formatter.format(new Date()));
    };
    update();
    const interval = setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <span
      className="local-time"
      aria-label={`Local time in ${siteConfig.location}${time ? `: ${time}` : ""}`}
    >
      <span>{siteConfig.location} / LOCAL TIME</span>
      <span>{time ?? "— — : — —"}</span>
    </span>
  );
}
