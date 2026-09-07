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
    const sections = ["work", "tools", "about", "github", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => !!section);
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".site-header nav a"),
    );
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    let frame = 0;
    const updateHeader = () => {
      frame = 0;
      header?.classList.toggle(
        "is-scrolled",
        window.scrollY > (hero?.offsetHeight ?? 850) * 0.32,
      );
      const active = sections
        .filter(
          (section) =>
            section.getBoundingClientRect().top <= window.innerHeight * 0.4,
        )
        .at(-1)?.id;
      navLinks.forEach((link) => {
        if (link.hash === `#${active}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      const percentage =
        distance > 0
          ? Math.min(
              100,
              Math.max(0, Math.round((window.scrollY / distance) * 100)),
            )
          : 0;
      progress?.style.setProperty(
        "--scroll-progress",
        String(percentage / 100),
      );
      const label = progress?.querySelector("span");
      if (label) label.textContent = String(percentage).padStart(2, "0");
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateHeader);
    };
    updateHeader();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    void import("@/lib/animations").then(({ initializeAnimations }) => {
      if (!disposed) teardown = initializeAnimations();
    });
    return () => {
      disposed = true;
      teardown?.();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);
  return (
    <>
      <CustomCursor />
      <div className="scroll-progress" aria-hidden="true">
        <span>00</span>
        <div>
          <i />
        </div>
      </div>
    </>
  );
}
