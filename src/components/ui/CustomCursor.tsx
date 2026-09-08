"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FOLLOW_SPEED = 0.2;
const SETTLE_DISTANCE = 0.1;

export default function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = cursor.current;
    const media = window.matchMedia(
      "(min-width: 901px) and (hover: hover) and (pointer: fine)",
    );
    if (!node || reduced || !media.matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let initialized = false;
    let lastInteractive: HTMLElement | null = null;

    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      initialized = false;
      node.classList.remove("cursor-visible");
      document.documentElement.classList.remove("has-custom-cursor");
    };
    const tick = () => {
      x += (targetX - x) * FOLLOW_SPEED;
      y += (targetY - y) * FOLLOW_SPEED;
      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame =
        Math.abs(targetX - x) + Math.abs(targetY - y) > SETTLE_DISTANCE
          ? requestAnimationFrame(tick)
          : 0;
    };
    const move = (event: PointerEvent) => {
      if (
        event.pointerType !== "mouse" ||
        !media.matches ||
        document.hidden ||
        document.querySelector("dialog[open]")
      ) {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!initialized) {
        x = targetX;
        y = targetY;
        initialized = true;
      }
      node.classList.add("cursor-visible");
      document.documentElement.classList.add("has-custom-cursor");
      const target = event.target instanceof Element ? event.target : null;
      const interactive =
        target?.closest<HTMLElement>("a,button,[data-cursor]") ?? null;
      if (interactive !== lastInteractive) {
        lastInteractive = interactive;
        node.dataset.active = interactive ? "true" : "false";
        if (node.firstElementChild)
          node.firstElementChild.textContent =
            interactive?.dataset.cursor ?? (interactive ? "↗" : "");
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Tab") hide();
    };
    const dialogChanged = (event: Event) => {
      if (event.target instanceof HTMLDialogElement) hide();
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("keydown", keyboard);
    document.addEventListener("toggle", dialogChanged, true);
    window.addEventListener("blur", hide);
    media.addEventListener("change", hide);
    document.addEventListener("visibilitychange", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("toggle", dialogChanged, true);
      window.removeEventListener("blur", hide);
      media.removeEventListener("change", hide);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [reduced]);

  return (
    <div className="custom-cursor" ref={cursor} aria-hidden="true">
      <span />
    </div>
  );
}
