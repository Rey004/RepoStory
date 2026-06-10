/**
 * GitHub API client for RepoStory
 * Fetches repository metadata, languages, releases, contributors, and commit logs.
 */

const GITHUB_API_BASE = "https://api.github.com";

/**
 * Helper to get authorization headers if GITHUB_TOKEN is present in env.
 */
function getHeaders() {
  const headers = {
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "RepoStory-App",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

/**
 * Fetch JSON from GitHub API with safety handling.
 */
async function fetchGithub(url) {
  try {
    const res = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: 3600 }, // Cache responses for 1 hour
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        throw new Error("GitHub API Rate limit exceeded. Try again later or configure GITHUB_TOKEN.");
      }
      if (res.status === 404) {
        throw new Error("Repository not found. Check the URL and make sure it is public.");
      }
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    throw error;
  }
}

/**
 * Fetch all required repository statistics.
 */
export async function fetchRepoData(owner, repo) {
  const cleanOwner = encodeURIComponent(owner);
  const cleanRepo = encodeURIComponent(repo);

  try {
    // 1. Fetch main repository metadata
    const repoDetails = await fetchGithub(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}`);

    // 2. Fetch languages (errors should not crash the main card)
    let languages = {};
    try {
      languages = await fetchGithub(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/languages`);
    } catch (err) {
      console.warn("Failed to fetch languages:", err.message);
    }

    // 3. Fetch releases
    let releases = [];
    try {
      releases = await fetchGithub(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/releases?per_page=10`);
    } catch (err) {
      console.warn("Failed to fetch releases:", err.message);
    }

    // 4. Fetch contributors
    let contributors = [];
    try {
      contributors = await fetchGithub(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/contributors?per_page=20`);
    } catch (err) {
      console.warn("Failed to fetch contributors:", err.message);
    }

    // 5. Fetch recent commits (to analyze activity and weekly patterns)
    let commits = [];
    try {
      commits = await fetchGithub(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/commits?per_page=50`);
    } catch (err) {
      console.warn("Failed to fetch commits:", err.message);
    }

    return {
      repoDetails: {
        name: repoDetails.name,
        fullName: repoDetails.full_name,
        description: repoDetails.description || "No description provided.",
        stars: repoDetails.stargazers_count,
        forks: repoDetails.forks_count,
        watchers: repoDetails.watchers_count,
        openIssues: repoDetails.open_issues_count,
        createdAt: repoDetails.created_at,
        updatedAt: repoDetails.updated_at,
        pushedAt: repoDetails.pushed_at,
        homepage: repoDetails.homepage,
        owner: {
          login: repoDetails.owner.login,
          avatarUrl: repoDetails.owner.avatar_url,
          htmlUrl: repoDetails.owner.html_url,
        },
        license: repoDetails.license ? repoDetails.license.spdx_id || repoDetails.license.name : null,
      },
      languages,
      releases: releases.map(r => ({
        name: r.name || r.tag_name,
        tagName: r.tag_name,
        publishedAt: r.published_at,
        htmlUrl: r.html_url,
      })),
      contributors: contributors.map(c => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
      })),
      commits: commits.map(c => ({
        sha: c.sha,
        author: c.commit.author.name,
        date: c.commit.author.date,
        message: c.commit.message,
      })),
    };
  } catch (error) {
    throw error;
  }
}
