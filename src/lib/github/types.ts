export interface GithubUser {
  login: string;
  name: string | null;
  html_url: string;
  avatar_url: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  html_url: string;
  description: string | null;
  language: string | null;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string | null;
  fork: boolean;
  archived: boolean;
  private: boolean;
  size: number;
}

export type RepositoryLanguages = Record<string, number>;
export type PushedRepository = GithubRepository & { pushed_at: string };
export interface LanguageShare {
  name: string;
  bytes: number;
  percentage: number;
}
export interface GithubStats {
  repositories: number;
  followers: number;
  following: number;
  stars: number;
}
export type GithubResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: "GitHub data temporarily unavailable." };
export type ProjectCategory =
  "security" | "frontend" | "automation" | "tool" | "learning";

export interface GithubPortfolio {
  user: GithubUser | null;
  repositories: GithubRepository[];
  featured: GithubRepository[];
  stats: GithubStats | null;
  languages: LanguageShare[];
  latest: PushedRepository | null;
  repositoriesAvailable: boolean;
  languagesAvailable: boolean;
  fetchedAt: string;
}
