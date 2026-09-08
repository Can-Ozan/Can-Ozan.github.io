"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/siteConfig";

export function useCopyEmail() {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const copy = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(siteConfig.email);
      if (!alive.current) return;
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 1500);
    } catch {
      if (alive.current) setStatus("manual");
    }
  }, []);
  return { status, copy };
}
