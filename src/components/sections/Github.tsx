import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { GITHUB_UNAVAILABLE } from "@/lib/github/helpers";
import { profile } from "@/data/profile";
import type { GithubPortfolio } from "@/lib/github/types";
import { RepositoryTicker } from "./RepositoryTicker";

export function Github({ data }: { data: GithubPortfolio }) {
  const stats = data.stats
    ? [
        { label: "Repositories", value: data.stats.repositories },
        { label: "Followers", value: data.stats.followers },
        { label: "Following", value: data.stats.following },
        { label: "Total stars", value: data.stats.stars },
      ]
    : [];
  return (
    <section
      className="github-section"
      id="github"
      aria-labelledby="github-title"
    >
      <SectionLabel index="04">GitHub / Out in the open</SectionLabel>
      <div className="github-layout">
        <h2 id="github-title" data-reveal>
          Building.
          <br />
          <span>Breaking.</span>
          <br />
          Learning.
          <br />
          <em>Shipping.</em>
        </h2>
        <div className="github-aside">
          {data.user?.avatar_url ? (
            <Image
              src={data.user.avatar_url}
              width={50}
              height={50}
              className="github-avatar"
              alt={`${data.user.login} on GitHub`}
              loading="lazy"
            />
          ) : (
            <GithubIcon size={43} />
          )}
          <p>
            The work.
            <br />
            And the work in progress.
          </p>
          <a
            className="text-link"
            href={data.user?.html_url ?? profile.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="GITHUB ↗"
          >
            @{data.user?.login ?? "Can-Ozan"}
            <ArrowUpRight size={25} />
          </a>
          {data.stats ? (
            <dl className="github-stats">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{String(stat.value).padStart(2, "0")}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="github-unavailable">{GITHUB_UNAVAILABLE}</p>
          )}
          <span className="github-footnote">
            <i className="status-dot" /> PUBLIC DATA, STRAIGHT FROM GITHUB.
          </span>
        </div>
      </div>
      {data.latest && (
        <div className="currently-building">
          <div className="eyebrow">
            <i className="status-dot" /> CURRENTLY BUILDING
          </div>
          <div>
            <a
              href={data.latest.html_url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="GITHUB ↗"
            >
              {data.latest.name}
              <ArrowUpRight size={27} />
            </a>
            <p>
              Last push:{" "}
              <RelativeTime date={data.latest.pushed_at} now={data.fetchedAt} />
            </p>
          </div>
          <a
            className="text-link"
            href={data.latest.html_url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="GITHUB ↗"
          >
            View repo <ArrowUpRight size={18} />
          </a>
        </div>
      )}
      {data.repositoriesAvailable && data.repositories.length > 0 && (
        <RepositoryTicker repositories={data.repositories} />
      )}
    </section>
  );
}
