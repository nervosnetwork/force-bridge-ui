export interface Version {
  sha: string;
  repoUrl: string;
  repoUrlWithSha: string;
}

export function fromEnv(): Version {
  const repoUrl = process.env.REACT_APP_REPO_UI_URL;
  const sha = process.env.REACT_APP_REPO_UI_GIT_SHA;
  return { repoUrl, sha, repoUrlWithSha: `${repoUrl}/tree/${sha}` };
}
