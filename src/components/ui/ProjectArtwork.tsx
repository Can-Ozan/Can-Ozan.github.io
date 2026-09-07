import { ArrowUpRight, Command, GitBranch, LockKeyhole } from "lucide-react";
import {
  categoryLabels,
  getProjectCategory,
  repositoryTitle,
} from "@/lib/github/helpers";
import type { GithubRepository } from "@/lib/github/types";

export function ProjectArtwork({
  repository,
  index = 0,
  compact = false,
}: {
  repository: GithubRepository;
  index?: number;
  compact?: boolean;
}) {
  const category = getProjectCategory(repository);
  const terminal = category === "security" && repository.language === "Go";
  return (
    <span
      className={`art-block project-art repo-art art-${category} cover-${index % 4} ${terminal ? "art-terminal" : ""} ${compact ? "art-compact" : ""}`}
      aria-hidden="true"
    >
      <span className="art-block art-topline">
        <span>CAN—OZAN</span>
        <span>PROJECT / {String(index + 1).padStart(2, "0")}</span>
      </span>
      <span className="art-block repo-cover-title">
        {repositoryTitle(repository.name)}
      </span>
      {!compact && (
        <span className="art-block repo-cover-composition">
          {terminal || category === "automation" ? (
            <span className="art-block repo-terminal">
              <span className="art-block repo-terminal-bar">
                <i />
                <i />
                <i />
                <span>{repository.language ?? "SOURCE"}</span>
              </span>
              <span className="art-block terminal-command">
                <span>$</span> {repository.name}
              </span>
              <span className="art-block terminal-flow">
                <span>
                  <Command size={16} /> INPUT
                </span>
                <i />
                <span>
                  <GitBranch size={16} /> PROCESS
                </span>
                <i />
                <span>↗ OUTPUT</span>
              </span>
              <small>INTERFACE STUDY — DECORATIVE PREVIEW</small>
            </span>
          ) : category === "security" ? (
            <span className="art-block repo-security">
              <LockKeyhole size={29} strokeWidth={1.1} />
              <span className="art-block password-dots">••••••••••••</span>
              <span className="art-block password-bars">
                <i />
                <i />
                <i />
                <i />
              </span>
              <small>INTERFACE STUDY / {repository.language}</small>
            </span>
          ) : category === "frontend" ? (
            <span className="art-block repo-browser">
              <span className="art-block repo-browser-chrome">
                <i />
                <i />
                <i />
                <span>{repository.name}</span>
                <ArrowUpRight size={12} />
              </span>
              <span className="art-block repo-browser-body">
                <span className="browser-mark">✳</span>
                <span className="art-block">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="browser-corner">↗</span>
              </span>
            </span>
          ) : (
            <span className="art-block repo-tool-composition">
              <span>↘</span>
              <span className="art-block tool-document">
                <span>{repository.language ?? "CODE"}</span>
                <i />
                <i />
                <i />
                <Command size={25} />
              </span>
              <span>↗</span>
            </span>
          )}
        </span>
      )}
      {compact && (
        <span className="art-block poster-symbol">
          {category === "security" ? (
            <LockKeyhole strokeWidth={1} />
          ) : category === "frontend" ? (
            "✳"
          ) : (
            <Command strokeWidth={1} />
          )}
        </span>
      )}
      <span className="art-block art-bottomline">
        <span className="art-block">
          <span>{categoryLabels[category]}</span>
          <strong>{repository.language ?? "LANGUAGE NOT SPECIFIED"}</strong>
        </span>
        <ArrowUpRight size={22} />
      </span>
    </span>
  );
}
