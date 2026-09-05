export interface GithubActivity {
  label: string;
  href: string;
  date?: string;
}

export interface GithubProfile {
  username: string;
  url: string;
  activity?: GithubActivity[];
}
