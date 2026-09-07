import type {
  GithubRepository,
  GithubStats,
  GithubUser,
  LanguageShare,
  ProjectCategory,
  PushedRepository,
  RepositoryLanguages,
} from "./types";

export const GITHUB_USERNAME = "Can-Ozan";
export const GITHUB_UNAVAILABLE =
  "GitHub data temporarily unavailable." as const;

export function getOwnedRepositories(repositories: GithubRepository[]) {
  return repositories.filter(
    (repo) =>
      repo.owner.login.toLowerCase() === GITHUB_USERNAME.toLowerCase() &&
      !repo.private &&
      !repo.fork &&
      !repo.archived,
  );
}

export function getFeaturedRepositories(
  repositories: GithubRepository[],
  limit = 4,
) {
  const candidates = getOwnedRepositories(repositories).filter(
    (repo) =>
      repo.size > 0 &&
      repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase(),
  );
  const latestUpdate = Math.max(
    0,
    ...candidates.map((repo) => Date.parse(repo.updated_at)),
  );
  const score = (repo: GithubRepository) => {
    const ageDays = Math.max(
      0,
      (latestUpdate - Date.parse(repo.updated_at)) / 86_400_000,
    );
    const learning = /(?:days-of|tutorial|challenge)/i.test(repo.name);
    return (
      (repo.description ? 40 : 0) +
      (safeHomepage(repo.homepage) ? 15 : 0) +
      Math.min(repo.topics.length * 3, 15) +
      Math.max(0, 15 - ageDays / 15) +
      Math.log2(repo.stargazers_count + 1) * 4 -
      (learning ? 35 : 0)
    );
  };
  return [...candidates]
    .sort(
      (a, b) =>
        score(b) - score(a) ||
        b.updated_at.localeCompare(a.updated_at) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, Math.max(0, Math.min(6, limit)));
}

export function getGithubStats(
  user: GithubUser,
  repositories: GithubRepository[],
): GithubStats {
  return {
    repositories: user.public_repos,
    followers: user.followers,
    following: user.following,
    stars: repositories.reduce(
      (total, repo) => total + repo.stargazers_count,
      0,
    ),
  };
}

export function aggregateLanguages(
  results: RepositoryLanguages[],
): LanguageShare[] {
  const totals = new Map<string, number>();
  for (const languages of results)
    for (const [name, bytes] of Object.entries(languages))
      if (bytes > 0) totals.set(name, (totals.get(name) ?? 0) + bytes);
  const total = [...totals.values()].reduce((sum, bytes) => sum + bytes, 0);
  return [...totals]
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: total ? (bytes / total) * 100 : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export function getLatestRepository(repositories: GithubRepository[]) {
  return (
    [...getOwnedRepositories(repositories)]
      .filter((repo): repo is PushedRepository => repo.pushed_at !== null)
      .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))[0] ??
    null
  );
}

export function getProjectCategory(repo: GithubRepository): ProjectCategory {
  const words =
    `${repo.name} ${repo.description ?? ""} ${repo.topics.join(" ")}`.toLowerCase();
  if (/security|password|scanner/.test(words)) return "security";
  if (/automation|webhook|workflow|cli/.test(words)) return "automation";
  if (/days-of|tutorial|challenge/.test(words)) return "learning";
  if (/portfolio|dashboard|widget|frontend|interface/.test(words))
    return "frontend";
  return "tool";
}

export const categoryLabels: Record<ProjectCategory, string> = {
  security: "Security / Development",
  frontend: "Web / Interface",
  automation: "Automation / Workflow",
  tool: "Developer tool",
  learning: "Notes / Experiments",
};

export function repositoryTitle(name: string) {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ");
}
export function repositoryId(repo: Pick<GithubRepository, "id">) {
  return `repo-${repo.id}`;
}
export function safeHomepage(value: string | null): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
export function formatPercentage(percentage: number) {
  return percentage > 0 && percentage < 0.1
    ? "<0.1%"
    : `${percentage.toFixed(1)}%`;
}
export function relativeTime(date: string, now: number) {
  const seconds = Math.max(0, Math.floor((now - Date.parse(date)) / 1000));
  if (!Number.isFinite(seconds)) return "Date unavailable";
  if (seconds < 60) return "just now";
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (seconds < 3600)
    return formatter.format(-Math.floor(seconds / 60), "minute");
  if (seconds < 86400)
    return formatter.format(-Math.floor(seconds / 3600), "hour");
  return formatter.format(-Math.floor(seconds / 86400), "day");
}
