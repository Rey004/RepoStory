import HeroTagline from "@/components/home/HeroTagline";
import HeroTitleMorph from "@/components/home/HeroTitleMorph";
import RepoSearchForm from "@/components/home/RepoSearchForm";
import InfoCards from "@/components/home/InfoCards";

export default function LandingView({
  isCut,
  showPixels,
  transitionPixels,
  repoUrl,
  onRepoUrlChange,
  onSubmit,
  error,
  isRateLimited,
  isTokenError,
  isLoading,
}) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center text-center gap-8 sm:gap-6 py-10 sm:py-8 relative z-10">
      <div className="flex flex-col items-center gap-6 sm:gap-4 w-full">
        <HeroTagline />
        <HeroTitleMorph
          isCut={isCut}
          showPixels={showPixels}
          transitionPixels={transitionPixels}
        />
        <RepoSearchForm
          repoUrl={repoUrl}
          onRepoUrlChange={onRepoUrlChange}
          onSubmit={onSubmit}
          error={error}
          isRateLimited={isRateLimited}
          isTokenError={isTokenError}
          isLoading={isLoading}
        />
        <InfoCards />
      </div>
    </div>
  );
}
