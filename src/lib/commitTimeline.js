function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncateMessage(message, max = 72) {
  const line = message.split("\n")[0].trim();
  if (line.length <= max) return line;
  return `${line.slice(0, max)}…`;
}

function pickSpacedCommits(commits, count = 4) {
  if (commits.length === 0) return [];
  if (commits.length <= count) return commits;

  const picked = [];
  for (let i = 0; i < count; i++) {
    const index = Math.round((i / (count - 1)) * (commits.length - 1));
    const commit = commits[index];
    if (!picked.find((c) => c.sha === commit.sha)) {
      picked.push(commit);
    }
  }
  return picked;
}

/**
 * Build a chronological timeline from real commit data, repo metadata, and releases.
 */
export function buildCommitTimeline(commits = [], repoDetails = {}, releases = []) {
  const events = [];

  if (repoDetails.createdAt) {
    events.push({
      id: "created",
      date: new Date(repoDetails.createdAt),
      title: "Repository Created",
      description: `@${repoDetails.owner?.login || "owner"} opened the repository on GitHub.`,
      type: "birth",
    });
  }

  const sortedCommits = [...commits].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  if (sortedCommits.length > 0) {
    const oldest = sortedCommits[0];
    events.push({
      id: `commit-${oldest.sha}`,
      date: new Date(oldest.date),
      title: "Earliest Tracked Commit",
      description: truncateMessage(oldest.message),
      type: "commit",
      sha: oldest.sha?.slice(0, 7),
      author: oldest.author,
    });

    const spaced = pickSpacedCommits(sortedCommits, 4).filter(
      (c) => c.sha !== oldest.sha
    );

    spaced.forEach((commit, index) => {
      const isLatest = commit.sha === sortedCommits[sortedCommits.length - 1].sha;
      events.push({
        id: `commit-${commit.sha}`,
        date: new Date(commit.date),
        title: isLatest ? "Latest Commit" : `Development Snapshot ${index + 1}`,
        description: truncateMessage(commit.message),
        type: "commit",
        sha: commit.sha?.slice(0, 7),
        author: commit.author,
      });
    });
  }

  const sortedReleases = [...releases]
    .filter((r) => r.publishedAt)
    .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));

  sortedReleases.forEach((release, index) => {
    events.push({
      id: `release-${release.tagName}`,
      date: new Date(release.publishedAt),
      title: index === 0 ? `First Release · ${release.tagName}` : `Release · ${release.tagName}`,
      description: `Tagged and published ${release.tagName}.`,
      type: "release",
    });
  });

  if (repoDetails.pushedAt) {
    const pushedDate = new Date(repoDetails.pushedAt);
    const hasRecentCommit = events.some(
      (e) =>
        e.type === "commit" &&
        Math.abs(e.date - pushedDate) < 1000 * 60 * 60 * 24
    );

    if (!hasRecentCommit) {
      events.push({
        id: "last-push",
        date: pushedDate,
        title: "Last Push",
        description: "Most recent activity pushed to the default branch.",
        type: "push",
      });
    }
  }

  const unique = [];
  const seen = new Set();
  for (const event of events.sort((a, b) => a.date - b.date)) {
    const key = `${event.type}-${event.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({
      ...event,
      dateLabel: formatDate(event.date),
    });
  }

  const birthMilestone = unique.find((m) => m.type === "birth");
  const earliestCommitMilestone = unique.find((m) => m.title === "Earliest Tracked Commit");

  const birthId = birthMilestone ? birthMilestone.id : null;
  const earliestCommitId = earliestCommitMilestone ? earliestCommitMilestone.id : null;
  const restMilestones = unique.filter((m) => m.id !== birthId && m.id !== earliestCommitId);

  const selected = [];
  if (birthMilestone) selected.push(birthMilestone);
  if (earliestCommitMilestone) selected.push(earliestCommitMilestone);

  const needed = 4 - selected.length;
  const recent = restMilestones.slice(-needed);
  selected.push(...recent);

  return selected.sort((a, b) => a.date - b.date);
}
