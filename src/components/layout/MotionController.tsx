"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import "lenis/dist/lenis.css";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export function MotionController() {
  useEffect(() => {
    let disposed = false;
    let teardown: (() => void) | undefined;
    const header = document.querySelector<HTMLElement>(".site-header");
    const hero = document.querySelector<HTMLElement>(".hero");
    const updateHeader = () =>
      header?.classList.toggle(
        "is-scrolled",
        window.scrollY > (hero?.offsetHeight ?? 850) * 0.32,
      );
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    void import("@/lib/animations").then(({ initializeAnimations }) => {
      if (!disposed) teardown = initializeAnimations();
    });
    return () => {
      disposed = true;
      teardown?.();
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);
  return <CustomCursor />;
}
