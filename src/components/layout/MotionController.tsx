"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import "lenis/dist/lenis.css";
import { chapters } from "@/data/siteConfig";
import { navigateToChapter } from "@/lib/interactions";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
  ssr: false,
});

export function MotionController() {
  useEffect(() => {
    let disposed = false;
    let teardown: (() => void) | undefined;
    const header = document.querySelector<HTMLElement>(".site-header");
    const hero = document.querySelector<HTMLElement>(".hero");
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
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
      const active =
        sections
          .filter(
            (section) =>
              section.getBoundingClientRect().top <= window.innerHeight * 0.4,
          )
          .at(-1)?.id ?? "top";
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
      const label = progress?.querySelector("[data-progress-value]");
      if (label) label.textContent = `${String(percentage).padStart(2, "0")}%`;
      const chapter =
        chapters.find((item) => item.id === active) ?? chapters[0];
      const chapterLabel = progress?.querySelector("[data-chapter-label]");
      if (chapterLabel)
        chapterLabel.textContent = `${chapter.number} / ${chapter.label.toUpperCase()}`;
      document
        .querySelector<HTMLElement>(".floating-back-top")
        ?.toggleAttribute("hidden", window.scrollY < window.innerHeight * 1.3);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateHeader);
    };
    updateHeader();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const navigate = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      const id = link?.hash.slice(1);
      if (id && document.getElementById(id)) {
        event.preventDefault();
        navigateToChapter(id);
      }
    };
    document.addEventListener("click", navigate);
    void import("@/lib/animations").then(({ initializeAnimations }) => {
      if (!disposed) teardown = initializeAnimations();
    });
    return () => {
      disposed = true;
      teardown?.();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      document.removeEventListener("click", navigate);
    };
  }, []);
  return (
    <>
      <CustomCursor />
      <div className="scroll-progress" aria-hidden="true">
        <span data-chapter-label>01 / INTRO</span>
        <div>
          <i />
        </div>
        <span data-progress-value>00%</span>
      </div>
      <a className="floating-back-top" href="#top" hidden data-cursor="BACK">
        ↑ TOP
      </a>
    </>
  );
}
