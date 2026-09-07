import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectPreview } from "@/components/ui/ProjectPreview";
import { AllRepositories } from "./AllRepositories";
import { GITHUB_UNAVAILABLE } from "@/lib/github/helpers";
import type { GithubPortfolio } from "@/lib/github/types";

export function SelectedWork({ data }: { data: GithubPortfolio }) {
  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <SectionLabel index="01">Selected work</SectionLabel>
      <div className="work-heading-row">
        <h2 className="section-heading" id="work-title" data-reveal>
          Selected <em>work.</em>
          {data.repositoriesAvailable && (
            <sup>({String(data.featured.length).padStart(2, "0")})</sup>
          )}
        </h2>
        <p>
          Tools, interfaces, and experiments. <br />
          Built to figure things out.
        </p>
      </div>
      {!data.repositoriesAvailable ? (
        <p className="github-unavailable" role="status">
          {GITHUB_UNAVAILABLE}
        </p>
      ) : data.featured.length ? (
        <div className="project-grid">
          {data.featured.map((repository, index) => (
            <ProjectPreview
              key={repository.id}
              repository={repository}
              index={index}
              now={data.fetchedAt}
            />
          ))}
        </div>
      ) : (
        <p className="github-unavailable">No public projects to feature yet.</p>
      )}
      {data.repositoriesAvailable && (
        <AllRepositories repositories={data.repositories} />
      )}
    </section>
  );
}
