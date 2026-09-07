"use client";
import { useState } from "react";
import type { GithubRepository } from "@/lib/github/types";

export function RepositoryTicker({
  repositories,
}: {
  repositories: GithubRepository[];
}) {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className="repository-ticker"
      role="group"
      aria-label="Public repositories"
      data-paused={paused}
    >
      <button
        className="ticker-toggle"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
      >
        {paused ? "Play ticker" : "Pause ticker"}
      </button>
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div className="ticker-copy" key={copy} aria-hidden={copy === 1}>
            {repositories.map((repository) => (
              <span key={repository.id}>
                {repository.name}
                <i>✳</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
