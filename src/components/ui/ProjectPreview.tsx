"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { GithubIcon as Github } from "./GithubIcon";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";
import { ProjectArtwork } from "./ProjectArtwork";

export function ProjectPreview({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);
  const reducedMotion = useReducedMotion();
  const openProject = () => {
    setOpened(true);
    dialog.current?.showModal();
  };
  const preview = project.image ? (
    <div className="project-image">
      <Image
        src={project.image}
        alt={`${project.title} interface preview`}
        fill
        sizes="(max-width: 700px) 100vw, 60vw"
      />
    </div>
  ) : (
    <ProjectArtwork visual={project.visual} />
  );

  return (
    <article
      className={`project project-${project.visual}`}
      id={project.id}
      data-reveal
    >
      <button
        className="project-visual"
        onClick={openProject}
        data-cursor="VIEW"
        aria-label={`View ${project.title} project details`}
      >
        <div className="preview-inner">{preview}</div>
        <span className="preview-open">
          <ArrowUpRight size={20} />
          <span>Explore project</span>
        </span>
      </button>
      <div className="project-meta">
        <span>
          {String(index + 1).padStart(2, "0")} / {project.category}
        </span>
        <span>{project.status}</span>
      </div>
      <div className="project-title-row">
        <h3>
          <button onClick={openProject} className="project-name">
            <span>{project.title}</span>
            <ArrowUpRight strokeWidth={1.3} size={28} />
          </button>
        </h3>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-bottom">
        <ul className="tech-tags" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <div className="project-links">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Explore Can–Ozan’s GitHub repositories for ${project.title}`}
          >
            <Github size={14} /> GitHub <ArrowUpRight size={12} />
          </a>
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              Live demo <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="project-dialog"
        aria-labelledby={`${project.id}-title`}
        aria-describedby={`${project.id}-overview`}
        onClose={() => setOpened(false)}
        data-lenis-prevent
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {opened && (
          <LazyMotion features={domAnimation}>
            <m.div
              className="dialog-inner"
              initial={{
                opacity: reducedMotion ? 1 : 0,
                y: reducedMotion ? 0 : 12,
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
            >
              <div className="dialog-header">
                <span className="eyebrow">
                  {String(index + 1).padStart(2, "0")} / {project.status}
                </span>
                <button
                  className="dialog-close"
                  onClick={() => dialog.current?.close()}
                  aria-label="Close project details"
                  autoFocus
                >
                  <X size={23} />
                </button>
              </div>
              <div className="dialog-art">{preview}</div>
              <div className="dialog-copy">
                <p className="eyebrow">{project.category}</p>
                <h2 id={`${project.id}-title`}>{project.title}</h2>
                <p id={`${project.id}-overview`}>{project.overview}</p>
                <ul className="tech-tags">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <div className="dialog-actions">
                  <a
                    className="text-link"
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore my GitHub <ArrowUpRight size={19} />
                  </a>
                  {project.demo && (
                    <a
                      className="text-link"
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open live demo <ArrowUpRight size={19} />
                    </a>
                  )}
                </div>
              </div>
            </m.div>
          </LazyMotion>
        )}
      </dialog>
    </article>
  );
}
