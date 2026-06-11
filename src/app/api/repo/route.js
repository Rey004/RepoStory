import { NextResponse } from "next/server";
import { fetchRepoData } from "@/lib/github";
import { analyzeRepository } from "@/lib/storyGenerator";

/**
 * Extract owner and repo from a GitHub URL or string.
 * Supports:
 * - https://github.com/owner/repo
 * - github.com/owner/repo
 * - owner/repo
 */
function parseGithubUrl(urlStr) {
  if (!urlStr) return null;
  
  let cleanUrl = urlStr.trim();
  
  // Remove protocols
  cleanUrl = cleanUrl.replace(/^(https?:\/\/)?(www\.)?github\.com\//i, "");
  
  // Remove trailing .git or slashes
  cleanUrl = cleanUrl.replace(/\.git\/?$/, "");
  cleanUrl = cleanUrl.replace(/\/$/, "");
  
  const parts = cleanUrl.split("/");
  if (parts.length >= 2) {
    return {
      owner: parts[0],
      repo: parts[1],
    };
  }
  
  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get("url");

  if (!repoUrl) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 }
    );
  }

  const parsed = parseGithubUrl(repoUrl);
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid GitHub repository URL. Format should be github.com/owner/repo or owner/repo" },
      { status: 400 }
    );
  }

  const { owner, repo } = parsed;

  try {
    // 1. Fetch raw data from GitHub API
    const repoData = await fetchRepoData(owner, repo);
    
    // 2. Perform story/archetype analysis
    const storyData = await analyzeRepository(repoData);

    // 3. Return combined response
    return NextResponse.json({
      success: true,
      githubData: repoData,
      storyData: storyData,
    });
  } catch (error) {
    console.error("API error for repo:", repoUrl, error.message);
    
    let status = 500;
    if (error.message.includes("not found")) {
      status = 404;
    } else if (error.message.includes("Rate limit")) {
      status = 429;
    } else if (error.message.includes("invalid or expired")) {
      status = 401;
    }

    return NextResponse.json(
      { error: error.message || "An error occurred while fetching repository data." },
      { status }
    );
  }
}
