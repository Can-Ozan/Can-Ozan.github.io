"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useId,
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
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { getCaseStudy } from "@/data/projectCaseStudies";
import { trapDialogFocus } from "@/lib/interactions";
import { MagneticButton } from "./MagneticButton";

gsap.registerPlugin(Flip);

type Selection = {
  repository: GithubRepository;
  index: number;
  trigger: HTMLButtonElement;
  origin: HTMLElement;
  flipId: string;
  flipState: ReturnType<typeof Flip.getState>;
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
  const art = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const reduced = useReducedMotion();
  const open = useCallback(
    (
      repository: GithubRepository,
      index: number,
      trigger: HTMLButtonElement,
    ) => {
      if (document.querySelector("dialog[open]")) return;
      const origin =
        trigger.querySelector<HTMLElement>(".project-art") ?? trigger;
      const flipId = trigger.dataset.projectTransition ?? String(repository.id);
      origin.dataset.flipId = flipId;
      closing.current = false;
      setSelection({
        repository,
        index,
        trigger,
        origin,
        flipId,
        flipState: Flip.getState(origin),
      });
      setVisible(true);
    },
    [],
  );
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (!reduced && art.current && selection?.origin.isConnected) {
      Flip.killFlipsOf(art.current, true);
      Flip.fit(art.current, selection.origin, {
        duration: 0.32,
        scale: true,
        ease: "power2.inOut",
      });
    }
    setVisible(false);
  }, [reduced, selection]);

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

  useLayoutEffect(() => {
    if (!selection || !art.current || reduced) return;
    const context = gsap.context(() => {
      Flip.from(selection.flipState, {
        targets: art.current,
        scale: true,
        duration: 0.55,
        ease: "power3.inOut",
      });
    });
    return () => context.revert();
  }, [selection, reduced]);

  useEffect(() => {
    if (!selection) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (dialog.current) trapDialogFocus(event, dialog.current);
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
  const study = repository ? getCaseStudy(repository.full_name) : undefined;
  const stack =
    study?.stack ?? (repository?.language ? [repository.language] : []);
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
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: reduced ? 0 : 0.34,
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
                        data-cursor="CLOSE"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="fullscreen-project-grid">
                      <div
                        className="dialog-art"
                        ref={art}
                        data-flip-id={selection.flipId}
                      >
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
                          PROJECT /{" "}
                          {study?.type ??
                            categoryLabels[getProjectCategory(repository)]}
                        </p>
                        <h2 id="active-project-title">{repository.name}</h2>
                        {!study?.problem && (
                          <p id="active-project-description">
                            {repository.description ??
                              "No description added on GitHub."}
                          </p>
                        )}
                        <dl className="case-study-details">
                          <div>
                            <dt>TYPE</dt>
                            <dd>
                              {study?.type ??
                                categoryLabels[getProjectCategory(repository)]}
                            </dd>
                          </div>
                          {study?.problem && (
                            <div>
                              <dt>PROBLEM</dt>
                              <dd id="active-project-description">
                                {study.problem}
                              </dd>
                            </div>
                          )}
                          {study?.approach && (
                            <div>
                              <dt>APPROACH</dt>
                              <dd>{study.approach}</dd>
                            </div>
                          )}
                          {stack.length > 0 && (
                            <div>
                              <dt>STACK</dt>
                              <dd>
                                <ul className="case-study-stack">
                                  {stack.map((technology) => (
                                    <li key={technology}>{technology}</li>
                                  ))}
                                </ul>
                              </dd>
                            </div>
                          )}
                          {study?.learned && (
                            <div>
                              <dt>LEARNED</dt>
                              <dd>{study.learned}</dd>
                            </div>
                          )}
                        </dl>
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
                          <MagneticButton
                            className="text-link"
                            href={repository.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="GITHUB ↗"
                          >
                            GitHub <ArrowUpRight size={20} />
                          </MagneticButton>
                          {demo && (
                            <MagneticButton
                              className="text-link"
                              href={demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-cursor="LIVE ↗"
                            >
                              Live <ArrowUpRight size={20} />
                            </MagneticButton>
                          )}
                        </div>
                        <p className="preview-note">
                          {study?.evidence ? (
                            <a
                              href={study.evidence}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-cursor="GITHUB ↗"
                            >
                              Explore the implementation ↗
                            </a>
                          ) : (
                            "Repository details from GitHub."
                          )}
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
  const transitionId = useId();
  return (
    <button
      className={className}
      onClick={(event) => open?.(repository, index, event.currentTarget)}
      data-cursor="VIEW"
      data-project-transition={transitionId}
      data-hover-project={
        className === "repository-row" || className === "project-name"
          ? repository.id
          : undefined
      }
      data-project-index={index}
      aria-label={`View ${repository.name} project details`}
    >
      {children}
    </button>
  );
}
