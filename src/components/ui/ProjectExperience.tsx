"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PROJECT_DIALOG_CHANGE } from "@/lib/modal-events";
import { ArrowUpRight, GitFork, Star, X } from "lucide-react";
import type { GithubRepository } from "@/lib/github/types";
import {
  categoryLabels,
  formatDate,
  getProjectCategory,
  safeHomepage,
} from "@/lib/github/helpers";
import { ProjectArtwork } from "./ProjectArtwork";

type Selection = {
  repository: GithubRepository;
  index: number;
  trigger: HTMLButtonElement;
  rect: { x: number; y: number; width: number; height: number };
};
const ProjectContext = createContext<
  | ((
      repository: GithubRepository,
      index: number,
      trigger: HTMLButtonElement,
    ) => void)
  | null
>(null);

export function ProjectExperience({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [visible, setVisible] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const open = useCallback(
    (
      repository: GithubRepository,
      index: number,
      trigger: HTMLButtonElement,
    ) => {
      const bounds = trigger.getBoundingClientRect();
      setSelection({
        repository,
        index,
        trigger,
        rect: {
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
        },
      });
      setVisible(true);
    },
    [],
  );
  const close = useCallback(() => setVisible(false), []);

  useLayoutEffect(() => {
    if (!selection || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    document.dispatchEvent(new Event(PROJECT_DIALOG_CHANGE));
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      // Native toggle is queued and may fire after the portal is detached.
      document.dispatchEvent(new Event(PROJECT_DIALOG_CHANGE));
    };
  }, [selection]);

  useEffect(() => {
    if (!selection) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "Tab" && dialog.current) {
        const controls = Array.from(
          dialog.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href]",
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        const active = document.activeElement;
        if (
          event.shiftKey &&
          last &&
          (active === first || !dialog.current.contains(active))
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          first &&
          (active === last || !dialog.current.contains(active))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selection, close]);

  const finishClose = () => {
    dialog.current?.close();
    selection?.trigger.focus({ preventScroll: true });
    setSelection(null);
  };
  const repository = selection?.repository;
  const demo = repository ? safeHomepage(repository.homepage) : null;
  return (
    <ProjectContext.Provider value={open}>
      <LazyMotion features={domAnimation}>
        {children}
        {selection &&
          repository &&
          createPortal(
            <dialog
              ref={dialog}
              className="project-dialog fullscreen-project"
              aria-labelledby="active-project-title"
              aria-describedby="active-project-description"
              data-lenis-prevent
              onCancel={(event) => {
                event.preventDefault();
                close();
              }}
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <AnimatePresence onExitComplete={finishClose}>
                {visible && (
                  <m.div
                    className="fullscreen-project-shell"
                    key={repository.id}
                    initial={
                      reduced
                        ? false
                        : {
                            opacity: 0,
                            x: selection.rect.x,
                            y: selection.rect.y,
                            scaleX: Math.max(
                              0.15,
                              selection.rect.width / window.innerWidth,
                            ),
                            scaleY: Math.max(
                              0.15,
                              selection.rect.height / window.innerHeight,
                            ),
                          }
                    }
                    animate={{ opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                    transition={{
                      duration: reduced ? 0 : 0.48,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: "top left" }}
                  >
                    <div className="dialog-header">
                      <span className="eyebrow">
                        {String(selection.index + 1).padStart(2, "0")} /{" "}
                        {categoryLabels[getProjectCategory(repository)]}
                      </span>
                      <button
                        ref={closeButton}
                        className="dialog-close"
                        onClick={close}
                        aria-label="Close project details"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="fullscreen-project-grid">
                      <div className="dialog-art">
                        <ProjectArtwork
                          repository={repository}
                          index={selection.index}
                        />
                      </div>
                      <m.div
                        className="dialog-copy"
                        initial={reduced ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: reduced ? 0 : 0.16,
                          duration: reduced ? 0 : 0.3,
                        }}
                      >
                        <p className="eyebrow">
                          {repository.language ?? "LANGUAGE NOT SPECIFIED"}
                        </p>
                        <h2 id="active-project-title">{repository.name}</h2>
                        <p id="active-project-description">
                          {repository.description ??
                            "No description added on GitHub."}
                        </p>
                        <dl className="overlay-stats">
                          <div>
                            <dt>
                              <Star size={14} /> Stars
                            </dt>
                            <dd>{repository.stargazers_count}</dd>
                          </div>
                          <div>
                            <dt>
                              <GitFork size={14} /> Forks
                            </dt>
                            <dd>{repository.forks_count}</dd>
                          </div>
                          <div>
                            <dt>Last updated</dt>
                            <dd>
                              <time dateTime={repository.updated_at}>
                                {formatDate(repository.updated_at)}
                              </time>
                            </dd>
                          </div>
                        </dl>
                        {repository.topics.length > 0 && (
                          <ul
                            className="tech-tags"
                            aria-label="Repository topics"
                          >
                            {repository.topics.map((topic) => (
                              <li key={topic}>{topic}</li>
                            ))}
                          </ul>
                        )}
                        <div className="dialog-actions">
                          <a
                            className="text-link"
                            href={repository.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="GITHUB ↗"
                          >
                            View source <ArrowUpRight size={20} />
                          </a>
                          {demo && (
                            <a
                              className="text-link"
                              href={demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-cursor="LIVE ↗"
                            >
                              Live site <ArrowUpRight size={20} />
                            </a>
                          )}
                        </div>
                        <p className="preview-note">
                          Artwork is an interface study. Repository details come
                          from GitHub.
                        </p>
                      </m.div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </dialog>,
            document.body,
          )}
      </LazyMotion>
    </ProjectContext.Provider>
  );
}

export function ProjectTrigger({
  repository,
  index,
  className,
  children,
}: {
  repository: GithubRepository;
  index: number;
  className: string;
  children: ReactNode;
}) {
  const open = useContext(ProjectContext);
  return (
    <button
      className={className}
      onClick={(event) => open?.(repository, index, event.currentTarget)}
      data-cursor="VIEW"
      aria-label={`View ${repository.name} project details`}
    >
      {children}
    </button>
  );
}
