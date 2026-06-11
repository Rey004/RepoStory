import GithubIcon from "@/components/icons/GithubIcon";
import GenerateButton from "@/components/GenerateButton";
import FormErrorMessage from "@/components/home/FormErrorMessage";

export default function RepoSearchForm({
  repoUrl,
  onRepoUrlChange,
  onSubmit,
  error,
  isRateLimited,
  isTokenError,
  isLoading,
}) {
  return (
    <div className="w-full max-w-xs sm:max-w-lg mx-auto flex flex-col gap-0">
      <form onSubmit={onSubmit} className="w-full animate-fade-in-delay-200">
        <div className="relative group rounded-2xl sm:rounded-full bg-zinc-950 border border-zinc-850 focus-within:border-[#00ff66] transition-all p-1 sm:p-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 pl-2.5 sm:pl-4 pr-1 sm:pr-1 shadow-none w-full">
          <div className="flex-1 flex items-center gap-1.5 sm:gap-2 py-0.5 sm:py-0">
            <GithubIcon className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-550 shrink-0" />
            <input
              id="repo-url-input"
              type="text"
              value={repoUrl}
              onChange={(e) => onRepoUrlChange(e.target.value)}
              placeholder="GitHub URL (e.g. facebook/react)"
              className="flex-1 bg-transparent text-[10px] sm:text-xs focus:outline-none placeholder-zinc-650 py-1 sm:py-2 text-white min-w-0"
              required
            />
          </div>
          <GenerateButton
            id="generate-btn"
            isGenerating={isLoading}
            className="shrink-0 scale-[0.88] sm:scale-100"
          />
        </div>
      </form>
      {/* Error lives outside the animated <form> so it appears instantly without delay */}
      <FormErrorMessage message={error} isRateLimited={isRateLimited} isTokenError={isTokenError} />
    </div>
  );
}
