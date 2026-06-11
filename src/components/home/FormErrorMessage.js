"use client";

import { AlertCircle, Clock, Zap, KeyRound } from "lucide-react";

/**
 * Shown below the search input.
 * - isRateLimited: friendly amber panel explaining rate limits
 * - isTokenError:  friendly amber panel explaining invalid/expired token
 * - otherwise:     generic red pill error
 */
export default function FormErrorMessage({ message, isRateLimited, isTokenError }) {
  if (!message) return null;

  if (isTokenError) {
    return (
      <div className="mt-4 p-4 rounded-2xl border border-amber-800/60 bg-amber-950/20 text-left font-mono animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-amber-400 text-xs font-semibold tracking-wide">
            GitHub token is invalid or expired
          </span>
        </div>

        <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">
          A GitHub token was found in your <span className="text-zinc-300 font-mono bg-zinc-900 px-1 py-0.5 rounded text-[10px]">.env</span> file, but GitHub rejected it — it may have been revoked or expired.
        </p>

        <div className="mt-3 pt-3 border-t border-amber-900/40">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">How to fix</p>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Generate a new token at{" "}
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300 transition-colors"
            >
              github.com/settings/tokens
            </a>{" "}
            and update your <span className="text-zinc-300 font-mono bg-zinc-900 px-1 py-0.5 rounded text-[10px]">.env</span> file, then restart the dev server.
            Or remove <span className="text-zinc-300 font-mono bg-zinc-900 px-1 py-0.5 rounded text-[10px]">GITHUB_TOKEN</span> entirely to use the free unauthenticated limit.
          </p>
        </div>
      </div>
    );
  }

  if (isRateLimited) {
    return (
      <div className="mt-4 p-4 rounded-2xl border border-amber-800/60 bg-amber-950/20 text-left font-mono animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-amber-400 text-xs font-semibold tracking-wide">
            GitHub API limit reached
          </span>
        </div>

        <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">
          GitHub only allows <span className="text-white font-semibold">60 free requests per hour</span> without an account token.
          RepoStory needs ~7 requests per repo, so the limit runs out quickly.
        </p>

        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <Clock className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
          <span>
            The limit resets every hour —{" "}
            <span className="text-zinc-300">try again in ~60 minutes</span>, or fix it permanently below.
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-amber-900/40">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Permanent fix</p>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Add a free{" "}
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300 transition-colors"
            >
              GitHub Personal Access Token
            </a>{" "}
            to your{" "}
            <span className="text-zinc-300 font-mono bg-zinc-900 px-1 py-0.5 rounded text-[10px]">.env</span>{" "}
            file — raises the limit to{" "}
            <span className="text-white font-semibold">5,000 requests/hour</span>.
          </p>
        </div>
      </div>
    );
  }

  // Generic error — red pill
  return (
    <div className="flex items-center gap-2 mt-4 p-3 rounded-full border border-red-900 bg-red-950/30 text-red-400 text-xs font-mono text-left px-5">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
