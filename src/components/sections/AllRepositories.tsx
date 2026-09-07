import { ArrowUpRight } from "lucide-react";
import { ProjectTrigger } from "@/components/ui/ProjectExperience";
import type { GithubRepository } from "@/lib/github/types";

export function AllRepositories({
  repositories,
}: {
  repositories: GithubRepository[];
}) {
  return (
    <div className="all-repositories">
      <div className="repository-list-heading">
        <h3>All repositories</h3>
        <span>
          {String(repositories.length).padStart(2, "0")} / PUBLIC & ORIGINAL
        </span>
      </div>
      <ol>
        {repositories.map((repository, index) => (
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
        ))}
      </ol>
    </div>
  );
}
