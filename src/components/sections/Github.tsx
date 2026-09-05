import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { profile } from "@/data/profile";
import type { GithubProfile } from "@/lib/github";
import { SectionLabel } from "@/components/ui/SectionLabel";

const githubProfile: GithubProfile = {
  username: "Can-Ozan",
  url: profile.github,
};

export function Github({ data = githubProfile }: { data?: GithubProfile }) {
  return (
    <section className="github-section" aria-labelledby="github-title">
      <SectionLabel index="04">Out in the open</SectionLabel>
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
          <GithubIcon size={50} strokeWidth={1.1} />
          <p>
            The finished work is only
            <br />
            part of the story.
          </p>
          <p className="github-small">
            Experiments, small utilities, and the things I’m figuring out along
            the way. It all lives on GitHub.
          </p>
          <a
            className="text-link"
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="OPEN"
          >
            @{data.username}
            <ArrowUpRight size={25} />
          </a>
          {data.activity && data.activity.length > 0 && (
            <ul className="github-activity">
              {data.activity.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                    {item.date && <time dateTime={item.date}>{item.date}</time>}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <span className="github-footnote">
            <i className="status-dot" /> ONE COMMIT AT A TIME.
          </span>
        </div>
      </div>
    </section>
  );
}
