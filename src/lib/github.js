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
  const isDev = process.env.NODE_ENV === "development";
  try {
    const res = await fetch(url, {
      headers: getHeaders(),
      next: { revalidate: isDev ? 0 : 3600 }, // No cache in dev, 1hr in prod
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("GitHub token is invalid or expired. Remove GITHUB_TOKEN from your .env file or generate a new one at github.com/settings/tokens.");
      }
      if (res.status === 403 || res.status === 429) {
        throw new Error("GitHub API Rate limit exceeded. Try again later or add a GITHUB_TOKEN to your .env file.");
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
 * Fetch only the Response headers (no body consumed) — used for Link header parsing.
 */
async function fetchGithubHead(url) {
  const isDev = process.env.NODE_ENV === "development";
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: isDev ? 0 : 3600 },
  });
  return res;
}

/**
 * Parse the 'last' page number from a GitHub Link header.
 * Returns null if there is no next/last page (i.e. only 1 page).
 * Example Link header:
 *   <https://api.github.com/...?page=2>; rel="next", <...?page=42>; rel="last"
 */
function parseLinkLastPage(linkHeader) {
  if (!linkHeader) return null;
  const match = linkHeader.match(/[?&]page=(\d+)>; rel="last"/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Get the true total count for a paginated GitHub endpoint.
 * Fetches per_page=1 and reads the last page number from the Link header.
 * Falls back to the length of the provided array if the probe fails.
 *
 * Handles GitHub's 202 Accepted (computing stats) for contributors endpoint
 * by retrying up to 3 times with a short delay.
 */
async function getTotalCount(url, fallback = 0, retries = 3) {
  try {
    const probeUrl = `${url}${url.includes("?") ? "&" : "?"}per_page=1`;
    const res = await fetchGithubHead(probeUrl);

    // GitHub returns 202 while computing contributor stats — retry after delay.
    if (res.status === 202 && retries > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return getTotalCount(url, fallback, retries - 1);
    }

    if (!res.ok) return fallback;
    const lastPage = parseLinkLastPage(res.headers.get("link"));
    // If no Link header, the full result fits in 1 page — count items in body.
    if (lastPage === null) {
      const data = await res.json();
      return Array.isArray(data) ? data.length : fallback;
    }
    return lastPage;
  } catch {
    return fallback;
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

    // 4. Fetch contributors (top 100 for display) + accurate total via Link header probe.
    //    IMPORTANT: Run sequentially, not in parallel.
    //    fetchContributors retries on 202 until GitHub finishes computing stats.
    //    After it succeeds, getTotalCount hits a warm endpoint and returns immediately.
    let contributors = [];
    let totalContributors = 0;
    try {
      const contribUrl = `${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/contributors`;
      const isDev = process.env.NODE_ENV === "development";

      const fetchContributors = async (retries = 5) => {
        const res = await fetch(`${contribUrl}?per_page=100`, {
          headers: getHeaders(),
          next: { revalidate: isDev ? 0 : 3600 },
        });
        if (res.status === 202 && retries > 0) {
          await new Promise((r) => setTimeout(r, 2000));
          return fetchContributors(retries - 1);
        }
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data.filter(Boolean) : [];
      };

      // Step 1: fetch display data (retries until 200 or exhausted; warms GitHub's cache)
      const contribData = await fetchContributors();
      contributors = contribData;

      // Step 2: exact total via per_page=1 probe.
      // fetchContributors already warmed GitHub's cache so this returns immediately.
      // linkTotal (lastPage × 100) overestimates by up to 99 — always use exact probe.
      const exactTotal = await getTotalCount(contribUrl, contributors.length);
      totalContributors = Math.max(exactTotal, contributors.length);
    } catch (err) {
      console.warn("Failed to fetch contributors:", err.message);
    }

    // 5. Fetch recent commits for timeline/grid.
    //    Read the Link header from the display response to get total count —
    //    avoids a separate per_page=1 probe API call.
    let commits = [];
    let totalCommits = 0;
    try {
      const isDev = process.env.NODE_ENV === "development";
      const commitsUrl = `${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/commits?per_page=100`;
      const commitsRes = await fetch(commitsUrl, {
        headers: getHeaders(),
        next: { revalidate: isDev ? 0 : 3600 },
      });
      if (commitsRes.ok) {
        const commitData = await commitsRes.json();
        commits = Array.isArray(commitData) ? commitData : [];
        const linkHeader = commitsRes.headers.get("link");
        const lastPage = parseLinkLastPage(linkHeader);
        // lastPage * 100 overestimates by up to 99; fine for display purposes.
        totalCommits = lastPage ? lastPage * 100 : commits.length;
      }
    } catch (err) {
      console.warn("Failed to fetch commits:", err.message);
    }

    // 5b. Get accurate open-issues count.
    //     open_issues_count from the repo API includes PRs, so we subtract
    //     the open PR count to get pure issues only.
    let openIssuesCount = repoDetails.open_issues_count; // fallback
    try {
      const openPrCount = await getTotalCount(
        `${GITHUB_API_BASE}/repos/${cleanOwner}/${cleanRepo}/pulls?state=open`,
        0
      );
      openIssuesCount = Math.max(0, repoDetails.open_issues_count - openPrCount);
    } catch (err) {
      console.warn("Failed to fetch accurate issue count:", err.message);
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
        // subscribers_count is the real watcher count; watchers_count is a
        // GitHub API quirk that mirrors stargazers_count (stars).
        watchers: repoDetails.subscribers_count ?? repoDetails.watchers_count,
        openIssues: openIssuesCount,
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
      totalContributors,
      totalCommits,
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
