import { ArrowDown, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/ui/ProjectArtwork";
import { ProjectTrigger } from "@/components/ui/ProjectExperience";
import { siteConfig } from "@/data/siteConfig";
import type { GithubRepository } from "@/lib/github/types";
import { GITHUB_UNAVAILABLE } from "@/lib/github/helpers";

export function Hero({
  repositories,
  available,
}: {
  repositories: GithubRepository[];
  available: boolean;
}) {
  const posters = [1, 2, 0].flatMap((index, slot) =>
    repositories[index]
      ? [
          {
            repository: repositories[index],
            index,
            position: ["poster-left", "poster-right", "poster-center"][slot],
          },
        ]
      : [],
  );
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-meta">
        <span>INDEPENDENT DEVELOPER & CREATIVE THINKER</span>
        <span className="hero-meta-right">PORTFOLIO — VOL. 01 / 2026</span>
      </div>
      <h1 className="hero-title" id="hero-title" aria-label="Yusuf Can Ozan">
        <span className="hero-name">
          CAN<span className="hero-dash">—</span>OZAN
        </span>
        <span className="hero-title-dot">®</span>
      </h1>
      <div className="hero-stage">
        <div className="stage-caption">
          A FEW THINGS
          <br />
          I’VE BEEN MAKING <ArrowDownRight size={22} />
        </div>
        <div className="hero-posters">
          {posters.map(({ repository, index, position }) => (
            <ProjectTrigger
              key={repository.id}
              repository={repository}
              index={index}
              className={`hero-poster ${position}`}
            >
              <span className="poster-tilt">
                <ProjectArtwork repository={repository} index={index} compact />
              </span>
            </ProjectTrigger>
          ))}
          {!available && (
            <p className="hero-data-fallback">{GITHUB_UNAVAILABLE}</p>
          )}
        </div>
        <div className="stage-edition">
          DESIGNED WITH INTENTION.
          <br />
          BUILT WITH CURIOSITY.
        </div>
      </div>
      <div className="hero-bottom">
        <div className="hero-intro">
          <span className="eyebrow">WEB DEVELOPER / CREATIVE DEVELOPER</span>
          <p>
            I build fast, interactive &<br />
            <em>thoughtful</em> digital experiences.
          </p>
        </div>
        <a
          className="hero-work-link"
          href="#work"
          data-cursor="GO"
          aria-label="Explore selected work"
        >
          <span>
            SCROLL TO
            <br />
            EXPLORE THE WORK
          </span>
          <span className="round-arrow">
            <ArrowDown size={26} strokeWidth={1.5} />
          </span>
        </a>
      </div>
      <div className="hero-footnote">
        <span>
          <i className="status-dot" /> {siteConfig.availabilityStatus}
        </span>
        <span>
          CODE. CRAFT. A LITTLE CHARACTER. <ArrowUpRight size={13} />
        </span>
      </div>
    </section>
  );
}
