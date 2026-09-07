import { ArrowUpRight, GitFork, Star } from "lucide-react";
import type { GithubRepository } from "@/lib/github/types";
import {
  categoryLabels,
  formatDate,
  getProjectCategory,
  repositoryId,
  safeHomepage,
} from "@/lib/github/helpers";
import { ProjectArtwork } from "./ProjectArtwork";
import { ProjectTrigger } from "./ProjectExperience";
import { RelativeTime } from "./RelativeTime";

export function ProjectPreview({
  repository,
  index,
  now,
}: {
  repository: GithubRepository;
  index: number;
  now: string;
}) {
  const demo = safeHomepage(repository.homepage);
  return (
    <article
      className={`project project-${getProjectCategory(repository)}`}
      id={repositoryId(repository)}
      data-reveal
    >
      <ProjectTrigger
        repository={repository}
        index={index}
        className="project-visual"
      >
        <span className="preview-inner">
          <ProjectArtwork repository={repository} index={index} />
        </span>
        <span className="preview-open">
          <ArrowUpRight size={20} />
          <span>View project</span>
        </span>
      </ProjectTrigger>
      <div className="project-meta">
        <span>
          {String(index + 1).padStart(2, "0")} /{" "}
          {categoryLabels[getProjectCategory(repository)]}
        </span>
        <span>{repository.language ?? "Unspecified"}</span>
      </div>
      <div className="project-title-row">
        <h3>
          <ProjectTrigger
            repository={repository}
            index={index}
            className="project-name"
          >
            <span>{repository.name}</span>
            <ArrowUpRight strokeWidth={1.3} size={28} />
          </ProjectTrigger>
        </h3>
      </div>
      {repository.description && (
        <p className="project-description">{repository.description}</p>
      )}
      <div className="repository-details">
        <span>
          <Star size={13} /> {repository.stargazers_count}
          <span className="sr-only"> stars</span>
        </span>
        <span>
          <GitFork size={13} /> {repository.forks_count}
          <span className="sr-only"> forks</span>
        </span>
        <span title={formatDate(repository.updated_at)}>
          Updated <RelativeTime date={repository.updated_at} now={now} />
        </span>
      </div>
      <div className="project-bottom">
        <ul className="tech-tags" aria-label={`${repository.name} topics`}>
          {repository.topics.slice(0, 4).map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
        <div className="project-links">
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="GITHUB ↗"
          >
            GitHub <ArrowUpRight size={13} />
          </a>
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="LIVE ↗"
            >
              Live site <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
