"use client";
import { useEffect, useRef } from "react";
import { formatPercentage, GITHUB_UNAVAILABLE } from "@/lib/github/helpers";
import type { LanguageShare } from "@/lib/github/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function LanguageBreakdown({
  languages,
  available,
}: {
  languages: LanguageShare[];
  available: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !root.current) return;
    const nodes = Array.from(
      root.current.querySelectorAll<HTMLElement>("[data-percentage]"),
    );
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (time: number) => {
          const progress = Math.min(1, (time - start) / 1100);
          const eased = 1 - Math.pow(1 - progress, 3);
          nodes.forEach((node) => {
            node.textContent = formatPercentage(
              Number(node.dataset.percentage) * eased,
            );
          });
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.2 },
    );
    observer.observe(root.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      nodes.forEach((node) => {
        node.textContent = formatPercentage(Number(node.dataset.percentage));
      });
    };
  }, [reduced, languages]);
  return (
    <div className="language-breakdown" ref={root}>
      <div>
        <h3>
          GitHub <em>languages.</em>
        </h3>
        <p>
          What the code is made of.
          <br />
          By bytes, across my original public repositories.
        </p>
      </div>
      {!available ? (
        <p className="github-unavailable">{GITHUB_UNAVAILABLE}</p>
      ) : languages.length ? (
        <dl>
          {languages.map((language) => (
            <div key={language.name}>
              <dt>{language.name}</dt>
              <dd>
                <span aria-hidden="true" data-percentage={language.percentage}>
                  {formatPercentage(language.percentage)}
                </span>
                <span className="sr-only">
                  {formatPercentage(language.percentage)
                    .replace("<", "Less than ")
                    .replace("%", " percent")}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>No language data available yet.</p>
      )}
    </div>
  );
}
