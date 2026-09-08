"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getCaseStudy, type ProjectFilter } from "@/data/projectCaseStudies";
import { profile } from "@/data/profile";
import { ProjectTrigger } from "@/components/ui/ProjectExperience";
import type { GithubRepository } from "@/lib/github/types";

export function AllRepositories({
  repositories,
}: {
  repositories: GithubRepository[];
}) {
  const [filter, setFilter] = useState<ProjectFilter | "all">("all");
  const categories = (
    ["web", "tools", "security", "experiments"] as const
  ).filter((category) =>
    repositories.some(
      (repo) => getCaseStudy(repo.full_name)?.category === category,
    ),
  );
  const showFilters = repositories.length >= 6 && categories.length >= 3;
  const filtered =
    filter === "all"
      ? repositories
      : repositories.filter(
          (repo) => getCaseStudy(repo.full_name)?.category === filter,
        );
  return (
    <div className="all-repositories">
      <div className="repository-list-heading">
        <h3>All repositories</h3>
        <span>
          {String(repositories.length).padStart(2, "0")} / PUBLIC & ORIGINAL
        </span>
      </div>
      {showFilters && (
        <div
          className="repository-filters"
          role="group"
          aria-label="Filter repositories"
        >
          {(["all", ...categories] as const).map((category) => (
            <button
              key={category}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
              data-cursor="EXPLORE"
            >
              {category}
            </button>
          ))}
          <span role="status">
            {filtered.length}{" "}
            {filtered.length === 1 ? "repository" : "repositories"}
          </span>
        </div>
      )}
      <ol className="filtered-repositories" key={filter}>
        {filtered.map((repository) => {
          const index = repositories.findIndex(
            (repo) => repo.id === repository.id,
          );
          return (
            <li key={repository.id}>
              <ProjectTrigger
                repository={repository}
                index={index}
                className="repository-row"
              >
                <span className="repository-row-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="repository-row-name">{repository.name}</span>
                <span className="repository-row-language">
                  {repository.language ?? "—"}
                </span>
                <time dateTime={repository.updated_at}>
                  {new Date(repository.updated_at).getUTCFullYear()}
                </time>
                <ArrowUpRight size={21} />
              </ProjectTrigger>
            </li>
          );
        })}
      </ol>
      <a
        className="text-link repository-more"
        href={`${profile.github}?tab=repositories`}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="GITHUB ↗"
      >
        All on GitHub <ArrowUpRight size={16} />
      </a>
    </div>
  );
}
