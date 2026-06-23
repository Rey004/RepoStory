import { buildCommitTimeline } from "@/lib/commitTimeline";

/**
 * Story Generator for RepoStory
 * Processes GitHub repo data and generates archetypes, timelines, and fun facts.
 */

// Custom rules for archetype detection
export function determineArchetype(stats) {
  const { stars, forks, contributors, createdAt, commits } = stats;
  const ageInDays = (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
  const contributorCount = contributors.length;
  
  if (contributorCount === 1 && commits.length > 5) {
    return {
      id: "solo_builder",
      name: "Solo Builder",
      description: "A passionate single developer crafting their vision block by block. Ultimate independence.",
      icon: "User",
      badgeColor: "bg-neutral-800 text-white border-neutral-700",
    };
  }
  
  if (ageInDays < 180 && stars > 100) {
    return {
      id: "rising_star",
      name: "Rising Star",
      description: "Newly born but taking off like a rocket! Showing rapid interest and community adoption.",
      icon: "TrendingUp",
      badgeColor: "bg-green-950 text-green-400 border-green-800",
    };
  }

  if (stars < 300 && forks > 40) {
    return {
      id: "hidden_gem",
      name: "Hidden Gem",
      description: "High utility with multiple forks but flying under the radar. Highly useful to those in the know.",
      icon: "Sparkles",
      badgeColor: "bg-yellow-950/40 text-yellow-400 border-yellow-800/60",
    };
  }

  if (contributorCount >= 8 || forks > 150) {
    return {
      id: "community_favorite",
      name: "Community Favorite",
      description: "Fueled by collaboration and community input. A bustling, open-source collective effort.",
      icon: "Users",
      badgeColor: "bg-blue-950 text-blue-400 border-blue-800",
    };
  }

  if (ageInDays > 1000 && stars > 1000 && commits.length < 5) {
    return {
      id: "legacy_giant",
      name: "Legacy Giant",
      description: "A battle-tested foundation. Steady, mature, and widely trusted, requiring little maintenance.",
      icon: "ShieldAlert",
      badgeColor: "bg-purple-950 text-purple-400 border-purple-800",
    };
  }

  return {
    id: "productive_explorer",
    name: "Active Explorer",
    description: "A solid utility repo making steady progress, forging its own path in the open-source landscape.",
    icon: "Compass",
    badgeColor: "bg-zinc-800 text-zinc-300 border-zinc-700",
  };
}

// Generate fun facts based on commit times and other stats
export function analyzeCommitPatterns(commits) {
  if (!commits || commits.length === 0) {
    return {
      timeOfDay: "Daylight Developer",
      dayOfWeek: "Weekday Warrior",
      description: "Steady developer who commits during business hours.",
    };
  }

  let nightOwlCount = 0;
  let weekendCount = 0;
  
  commits.forEach(c => {
    const date = new Date(c.date);
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    if (hour >= 23 || hour <= 5) {
      nightOwlCount++;
    }
    if (day === 0 || day === 6) {
      weekendCount++;
    }
  });

  const nightOwlRatio = nightOwlCount / commits.length;
  const weekendRatio = weekendCount / commits.length;

  let timeOfDay = "Daylight Developer";
  if (nightOwlRatio > 0.35) {
    timeOfDay = "Night Owl";
  } else if (nightOwlRatio < 0.1) {
    timeOfDay = "Early Bird";
  }

  let dayOfWeek = "Weekday Warrior";
  if (weekendRatio > 0.4) {
    dayOfWeek = "Weekend Warrior";
  } else if (weekendRatio < 0.1) {
    dayOfWeek = "Office Hours Only";
  }

  return {
    timeOfDay,
    dayOfWeek,
    nightOwlRatio: Math.round(nightOwlRatio * 100),
    weekendRatio: Math.round(weekendRatio * 100),
    nightCommitCount: nightOwlCount,
    weekendCommitCount: weekendCount,
    totalCommits: commits.length,
  };
}

// Local rules-based narrative generator (fallback)
export function generateLocalStory(stats, archetype, patterns) {
  const { name, owner, stars, forks, readmeSummary } = stats.repoDetails;
  const topLang = Object.keys(stats.languages)[0] || "JavaScript";
  
  let p1 = "";
  let p2 = "";

  switch (archetype.id) {
    case "solo_builder":
      p1 = `${name} is a high-focus creation crafted single-handedly by @${owner.login}. Instead of waiting for a committee, they've taken matters into their own hands, assembling a repository with ${stars} stars built on a pure foundation of ${topLang}.`;
      p2 = `Commit analysis reveals a true ${patterns.timeOfDay} spirit, working in bursts to ship features. This project stands as a testament to independent building in a world of complex teams.`;
      break;
    case "rising_star":
      p1 = `Lately, @${owner.login}/${name} has been turning heads. Launched recently, it has rapidly gathered ${stars} stars and sparked ${forks} forks, making it one of the most promising young utilities in the ${topLang} ecosystem.`;
      p2 = `With contributor energy running high, this project behaves like a classic ${patterns.dayOfWeek}, charging ahead with commits and updates. It's an exciting project to watch in the coming months.`;
      break;
    case "hidden_gem":
      p1 = `Inside the deep folds of GitHub lies @${owner.login}/${name}. While its star count of ${stars} is modest, its high fork count of ${forks} shows that developers aren't just looking—they're actively building on top of it.`;
      p2 = `Dominated by a strong ${patterns.timeOfDay} coding signature, this repo represents a silent workhorse that solves real problems without chasing mainstream hype.`;
      break;
    case "community_favorite":
      p1 = `@${owner.login}/${name} is a bustling open-source metropolis. Backed by ${stats.contributors.length}+ contributors, this project is built on collaborative discussion, PR cycles, and shared ownership.`;
      p2 = `Powered mostly by ${topLang}, its development patterns reflect a coordinated team effort, peaking as a ${patterns.dayOfWeek}. It has become a vital piece of infrastructure with ${stars} stars.`;
      break;
    case "legacy_giant":
      p1 = `@${owner.login}/${name} is a mature cornerstone of the developer stack. Having stood the test of time, this ${stars}-star project has reached the holy grail of software: stability.`;
      p2 = `With low recent churn, it acts as a reliable beacon. It is a highly optimized codebase that just works, leaving developers free to build rather than debug.`;
      break;
    default:
      p1 = `@${owner.login}/${name} is an active tool focused on solving developer problems in ${topLang}. Gathering ${stars} stars and ${forks} forks, it maintains a steady, productive heartbeat.`;
      p2 = `Driven by consistent ${patterns.dayOfWeek} rhythms, the repository continues to evolve and refine its features, showcasing the beauty of progressive refinement.`;
  }

  const readmeTail = readmeSummary
    ? ` README hints at the core mission: ${readmeSummary}`
    : "";

  return `${p1} ${p2}${readmeTail}`;
}

// Query Gemini API for AI stories if GITHUB_TOKEN or GEMINI_API_KEY is available
export async function generateAiStory(stats, archetype, patterns) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return local heuristic story
    return generateLocalStory(stats, archetype, patterns);
  }

  const { name, owner, description, stars, forks, openIssues, createdAt, readmeSummary, readmeHighlights } = stats.repoDetails;
  const languages = Object.entries(stats.languages)
    .slice(0, 3)
    .map(([lang, bytes]) => `${lang}`)
    .join(", ");
  
  const topContributor = stats.contributors[0] ? stats.contributors[0].login : "N/A";
  const numContributors = stats.contributors.length;

  const prompt = `
You are RepoStory AI, a witty developer-sociologist who reviews GitHub codebases and writes punchy, insightful, slightly humorous narratives.
Write a 3-4 sentence project story card summary for this GitHub repository:
- Name: ${name}
- Owner: @${owner.login}
- Description: "${description}"
- Created: ${new Date(createdAt).toLocaleDateString()}
- Stars: ${stars}
- Forks: ${forks}
- Open Issues: ${openIssues}
- Tech Stack: ${languages}
- Archetype determined: ${archetype.name} (${archetype.description})
- Contributor Count: ${numContributors} (Top contributor: @${topContributor})
- Commits Patterns: ${patterns.timeOfDay} commits (${patterns.nightOwlRatio}% night commits), ${patterns.dayOfWeek} pattern (${patterns.weekendRatio}% weekend commits).
- README Summary: "${readmeSummary || "N/A"}"
- README Key Sections: ${Array.isArray(readmeHighlights) && readmeHighlights.length > 0 ? readmeHighlights.join(", ") : "N/A"}

Keep it developer-focused, clean, engaging, and professional yet fun. Do not use generic corporate text. Mention their archetype and commit habits playfully. Avoid markdown symbols in the final output paragraph.
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const narrative = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (narrative) {
      return narrative.trim();
    }
    throw new Error("No text returned from Gemini API");
  } catch (err) {
    console.error("Gemini API error, falling back to local stories:", err.message);
    return generateLocalStory(stats, archetype, patterns);
  }
}

/**
 * Main analysis function
 */
export async function analyzeRepository(repoData) {
  const archetype = determineArchetype({
    stars: repoData.repoDetails.stars,
    forks: repoData.repoDetails.forks,
    contributors: repoData.contributors,
    createdAt: repoData.repoDetails.createdAt,
    commits: repoData.commits,
  });

  const commitPatterns = analyzeCommitPatterns(repoData.commits);
  
  // Call AI or Heuristic Story generator
  const story = await generateAiStory(repoData, archetype, commitPatterns);

  const milestones = buildCommitTimeline(
    repoData.commits,
    repoData.repoDetails,
    repoData.releases
  );

  return {
    archetype,
    commitPatterns,
    story,
    milestones,
    // Add additional metadata for display
    growthInsights: {
      starForkRatio: (repoData.repoDetails.stars / Math.max(1, repoData.repoDetails.forks)).toFixed(1),
      commitsAnalysed: repoData.commits.length,
      topContributorPct: repoData.contributors.length > 0
        ? Math.min(100, Math.round((repoData.contributors[0].contributions / Math.max(1, repoData.contributors.reduce((acc, c) => acc + c.contributions, 0))) * 100))
        : null,
    },
  };
}
