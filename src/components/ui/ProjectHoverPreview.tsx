"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { GithubRepository } from "@/lib/github/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PROJECT_DIALOG_CHANGE } from "@/lib/modal-events";
import { ProjectArtwork } from "./ProjectArtwork";

export function ProjectHoverPreview({
  repositories,
}: {
  repositories: GithubRepository[];
}) {
  const [preview, setPreview] = useState<{
    repository: GithubRepository;
    index: number;
  } | null>(null);
  const node = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (node.current) node.current.dataset.visible = "true";
  }, [preview]);
  useEffect(() => {
    const media = matchMedia(
      "(min-width: 901px) and (hover: hover) and (pointer: fine)",
    );
    if (reduced || !media.matches) return;
    let frame = 0,
      lastId = "",
      x = 0,
      y = 0;
    let width = 300,
      height = 326;
    const hide = () => {
      lastId = "";
      cancelAnimationFrame(frame);
      frame = 0;
      if (node.current) node.current.dataset.visible = "false";
    };
    const tick = () => {
      frame = 0;
      if (!lastId || !node.current) return;
      width = node.current.offsetWidth;
      height = node.current.offsetHeight;
      const targetX = Math.max(
        16,
        Math.min(innerWidth - width - 16, pointer.current.x + 28),
      );
      const targetY = Math.max(
        16,
        Math.min(innerHeight - height - 16, pointer.current.y - height / 2),
      );
      const delta = targetX - x;
      x += delta * 0.2;
      y += (targetY - y) * 0.2;
      node.current.style.transform = `translate3d(${x}px,${y}px,0) rotate(${Math.max(-3, Math.min(3, delta * 0.04))}deg)`;
      if (Math.abs(delta) + Math.abs(targetY - y) > 0.1)
        frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (
        event.pointerType !== "mouse" ||
        !media.matches ||
        document.querySelector("dialog[open]")
      ) {
        hide();
        return;
      }
      const trigger =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-hover-project]")
          : null;
      const id = trigger?.dataset.hoverProject;
      if (!id) {
        if (lastId) hide();
        return;
      }
      pointer.current = { x: event.clientX, y: event.clientY };
      if (id !== lastId) {
        const repository = repositories.find((repo) => String(repo.id) === id);
        if (!repository) return;
        lastId = id;
        x = Math.max(16, Math.min(innerWidth - width - 16, event.clientX + 28));
        y = Math.max(
          16,
          Math.min(innerHeight - height - 16, event.clientY - height / 2),
        );
        setPreview({
          repository,
          index: Number(trigger?.dataset.projectIndex ?? 0),
        });
        if (node.current) node.current.dataset.visible = "true";
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Escape") hide();
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("keydown", key);
    document.addEventListener(PROJECT_DIALOG_CHANGE, hide);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);
    media.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("keydown", key);
      document.removeEventListener(PROJECT_DIALOG_CHANGE, hide);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("blur", hide);
      media.removeEventListener("change", hide);
    };
  }, [repositories, reduced]);
  return (
    <div ref={node} className="hover-project-preview" aria-hidden="true">
      {preview && (
        <>
          <ProjectArtwork
            repository={preview.repository}
            index={preview.index}
          />
          <span className="hover-preview-caption">
            {preview.repository.language ?? "PROJECT"}
            <span>VIEW ↗</span>
          </span>
        </>
      )}
    </div>
  );
}
