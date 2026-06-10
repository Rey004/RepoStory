/**
 * GitHub API client for RepoStory
 * Fetches repository metadata, languages, releases, contributors, and commit logs.
 */

const GITHUB_API_BASE = "https://api.github.com";

function decodeBase64Utf8(base64String) {
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64String, "base64").toString("utf-8");
    }
  } catch {
    // Fall through to browser-safe decode path.
  }

  const binary = atob(base64String);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function extractReadmeInfo(markdownText) {
  if (!markdownText || typeof markdownText !== "string") {
    return {
      summary: null,
      highlights: [],
    };
  }

  // Remove fenced code blocks and normalize for cleaner prose extraction.
  const withoutCodeBlocks = markdownText.replace(/```[\s\S]*?```/g, " ");
  const normalized = withoutCodeBlocks.replace(/\r\n/g, "\n");
  const paragraphs = normalized
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const summary =
    paragraphs.find((block) => {
      if (block.length < 40) return false;
      if (/^#{1,6}\s/.test(block)) return false;
      if (/^!\[.*\]\(.*\)$/.test(block)) return false;
      if (/^<.*>$/.test(block)) return false;
      if (/^\|.*\|$/.test(block)) return false;
      if (/^\[!/.test(block)) return false;
      return true;
    }) || null;

  const headingMatches = [...normalized.matchAll(/^#{2,3}\s+(.+)$/gm)]
    .map((m) => m[1].trim())
    .filter(Boolean);

  return {
    summary: summary ? summary.slice(0, 320) : null,
    highlights: headingMatches.slice(0, 6),
  };
}

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
      commits = await fetchGithub(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/commits?per_page=100`);
    } catch (err) {
      console.warn("Failed to fetch commits:", err.message);
    }

    // 6. Fetch README and extract useful summary/highlights for the card
    let readmeInfo = {
      summary: null,
      highlights: [],
      htmlUrl: null,
    };
    try {
      const readme = await fetchGithub(`${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/readme`);
      const markdown = readme?.content ? decodeBase64Utf8(readme.content) : "";
      const parsed = extractReadmeInfo(markdown);
      readmeInfo = {
        ...parsed,
        htmlUrl: readme?.html_url || null,
      };
    } catch (err) {
      console.warn("Failed to fetch README:", err.message);
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
        readmeSummary: readmeInfo.summary,
        readmeHighlights: readmeInfo.highlights,
        readmeUrl: readmeInfo.htmlUrl,
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
