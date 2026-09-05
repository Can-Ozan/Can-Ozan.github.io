"use client";

import { useRef, type AnchorHTMLAttributes } from "react";

export function MagneticButton({
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const inner = useRef<HTMLSpanElement>(null);
  return (
    <a
      {...props}
      className={`magnetic-link ${className}`}
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (inner.current)
          inner.current.style.transform = `translate3d(${(event.clientX - rect.left - rect.width / 2) * 0.12}px, ${(event.clientY - rect.top - rect.height / 2) * 0.12}px, 0)`;
      }}
      onPointerLeave={() => {
        if (inner.current) inner.current.style.transform = "translate3d(0,0,0)";
      }}
    >
      <span ref={inner}>{children}</span>
    </a>
  );
}
