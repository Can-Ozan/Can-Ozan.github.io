import "server-only";
import { cache } from "react";
import {
  aggregateLanguages,
  getFeaturedRepositories,
  getGithubStats,
  getLatestRepository,
  getOwnedRepositories,
  GITHUB_UNAVAILABLE,
  GITHUB_USERNAME,
} from "./helpers";
import type {
  GithubPortfolio,
  GithubRepository,
  GithubResult,
  GithubUser,
  RepositoryLanguages,
} from "./types";

const API = "https://api.github.com";
const REQUEST_TIMEOUT = 10_000;
const API_VERSION = "2026-03-10";

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function count(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function nullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}
function githubUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function parseUser(value: unknown): GithubUser {
  if (record(value))
    value = { ...value, name: value.name ?? null, bio: value.bio ?? null };
  if (
    !record(value) ||
    typeof value.login !== "string" ||
    value.login.toLowerCase() !== GITHUB_USERNAME.toLowerCase() ||
    !githubUrl(value.html_url) ||
    !nullableString(value.name) ||
    !nullableString(value.bio) ||
    !count(value.public_repos) ||
    !count(value.followers) ||
    !count(value.following)
  )
    throw new Error("Invalid GitHub profile");
  return {
    login: value.login,
    name: value.name,
    html_url: value.html_url,
    avatar_url: avatarUrl(value.avatar_url),
    bio: value.bio,
    public_repos: value.public_repos,
    followers: value.followers,
    following: value.following,
  };
}

function parseRepository(value: unknown): GithubRepository {
  if (record(value))
    value = {
      ...value,
      description: value.description ?? null,
      language: value.language ?? null,
      homepage: value.homepage ?? null,
      pushed_at: value.pushed_at ?? null,
      topics: value.topics ?? [],
    };
  if (
    !record(value) ||
    !count(value.id) ||
    typeof value.name !== "string" ||
    typeof value.full_name !== "string" ||
    !record(value.owner) ||
    typeof value.owner.login !== "string" ||
    !githubUrl(value.html_url) ||
    !nullableString(value.description) ||
    !nullableString(value.language) ||
    !nullableString(value.homepage) ||
    !Array.isArray(value.topics) ||
    !value.topics.every((item) => typeof item === "string") ||
    !count(value.stargazers_count) ||
    !count(value.forks_count) ||
    !count(value.size) ||
    typeof value.updated_at !== "string" ||
    !Number.isFinite(Date.parse(value.updated_at)) ||
    !nullableString(value.pushed_at) ||
    (value.pushed_at !== null &&
      !Number.isFinite(Date.parse(value.pushed_at))) ||
    typeof value.fork !== "boolean" ||
    typeof value.archived !== "boolean" ||
    typeof value.private !== "boolean"
  )
    throw new Error("Invalid GitHub repository");
  return {
    id: value.id,
    name: value.name,
    full_name: value.full_name,
    owner: { login: value.owner.login },
    html_url: value.html_url,
    description: value.description,
    language: value.language,
    homepage: value.homepage,
    topics: [...new Set(value.topics)],
    stargazers_count: value.stargazers_count,
    forks_count: value.forks_count,
    size: value.size,
    updated_at: value.updated_at,
    pushed_at: value.pushed_at,
    fork: value.fork,
    archived: value.archived,
    private: value.private,
  };
}

function avatarUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "avatars.githubusercontent.com" &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

async function githubRequest(path: string): Promise<Response> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": API_VERSION,
    "User-Agent": "Can-Ozan-Portfolio",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(`${API}${path}`, {
    headers,
    // Default uncached fetch runs during static prerendering. React cache above
    // deduplicates calls within this build; no persisted data cache or runtime ISR.
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });
  if (!response.ok)
    throw new Error(`GitHub request failed (${response.status})`);
  return response;
}

export const getGithubUser = cache(
  async (): Promise<GithubResult<GithubUser>> => {
    try {
      return {
        ok: true,
        data: parseUser(
          await (await githubRequest(`/users/${GITHUB_USERNAME}`)).json(),
        ),
      };
    } catch {
      console.warn(
        "[GitHub build] Profile unavailable; profile statistics will be omitted. Retry the build to refresh.",
      );
      return { ok: false, error: GITHUB_UNAVAILABLE };
    }
  },
);

export const getGithubRepositories = cache(
  async (): Promise<GithubResult<GithubRepository[]>> => {
    try {
      const repositories: GithubRepository[] = [];
      for (let page = 1; page <= 20; page++) {
        const response = await githubRequest(
          `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&page=${page}`,
        );
        const payload: unknown = await response.json();
        if (!Array.isArray(payload))
          throw new Error("Invalid GitHub repository collection");
        repositories.push(
          ...payload
            .map(parseRepository)
            .filter(
              (repo) =>
                !repo.private &&
                repo.owner.login.toLowerCase() ===
                  GITHUB_USERNAME.toLowerCase(),
            ),
        );
        if (!response.headers.get("link")?.includes('rel="next"'))
          return {
            ok: true,
            data: [
              ...new Map(repositories.map((repo) => [repo.id, repo])).values(),
            ],
          };
      }
      throw new Error("GitHub repository pagination incomplete");
    } catch {
      console.warn(
        "[GitHub build] Repository data unavailable or incomplete; projects and statistics will show an unavailable state. Retry the build to refresh.",
      );
      return { ok: false, error: GITHUB_UNAVAILABLE };
    }
  },
);

export const getRepositoryLanguages = cache(
  async (
    repositoryName: string,
  ): Promise<GithubResult<RepositoryLanguages>> => {
    try {
      const response = await githubRequest(
        `/repos/${GITHUB_USERNAME}/${encodeURIComponent(repositoryName)}/languages`,
      );
      const payload: unknown = await response.json();
      if (!record(payload)) throw new Error("Invalid GitHub language totals");
      const totals: RepositoryLanguages = {};
      for (const [name, bytes] of Object.entries(payload)) {
        if (!count(bytes)) throw new Error("Invalid GitHub language totals");
        Object.defineProperty(totals, name, { value: bytes, enumerable: true });
      }
      return { ok: true, data: totals };
    } catch {
      console.warn(
        `[GitHub build] Languages unavailable for ${repositoryName}; incomplete language percentages will be omitted.`,
      );
      return { ok: false, error: GITHUB_UNAVAILABLE };
    }
  },
);

export const getGithubPortfolio = cache(async (): Promise<GithubPortfolio> => {
  const [user, repositories] = await Promise.all([
    getGithubUser(),
    getGithubRepositories(),
  ]);
  const all = repositories.ok ? repositories.data : [];
  const owned = getOwnedRepositories(all);
  const languages: GithubResult<RepositoryLanguages>[] = [];
  // A small concurrency limit keeps the languages endpoint below GitHub's secondary limits.
  for (let index = 0; index < owned.length; index += 4)
    languages.push(
      ...(await Promise.all(
        owned
          .slice(index, index + 4)
          .map((repo) => getRepositoryLanguages(repo.name)),
      )),
    );
  const languagesAvailable =
    repositories.ok && languages.every((result) => result.ok);
  return {
    user: user.ok ? user.data : null,
    repositories: owned,
    featured: getFeaturedRepositories(all),
    stats: user.ok && repositories.ok ? getGithubStats(user.data, all) : null,
    languages: languagesAvailable
      ? aggregateLanguages(
          languages.flatMap((result) => (result.ok ? [result.data] : [])),
        )
      : [],
    latest: getLatestRepository(all),
    repositoriesAvailable: repositories.ok,
    languagesAvailable,
    fetchedAt: new Date().toISOString(),
  };
});

export { getFeaturedRepositories, getGithubStats } from "./helpers";
