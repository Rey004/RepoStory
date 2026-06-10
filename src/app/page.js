"use client";

import CursorEffects from "@/components/cursor/CursorEffects";
import PixelGlowBackground from "@/components/background/PixelGlowBackground";
import LandingAmbientGlow from "@/components/background/LandingAmbientGlow";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import LandingView from "@/components/home/LandingView";
import LoadingTerminal from "@/components/home/LoadingTerminal";
import StoryWorkstation from "@/components/home/StoryWorkstation";
import { useCursorEffects } from "@/hooks/useCursorEffects";
import { useRandomBackgroundPixels } from "@/hooks/useRandomBackgroundPixels";
import { useTitleMorphAnimation } from "@/hooks/useTitleMorphAnimation";
import { useRepoStory } from "@/hooks/useRepoStory";

export default function Home() {
  const {
    rootRef,
    glowRef,
    cursorRef,
    cursorBoxRef,
    handleMouseMove,
    handleMouseLeave,
  } = useCursorEffects();

  const randomPixels = useRandomBackgroundPixels();
  const { isCut, showPixels, transitionPixels } = useTitleMorphAnimation();

  const {
    repoUrl,
    setRepoUrl,
    isLoading,
    loadingStepIndex,
    storyData,
    error,
    isLightMode,
    setIsLightMode,
    handleSubmit,
    handleReset,
  } = useRepoStory();

  const showLanding = !isLoading && !storyData;

  return (
    <div
      ref={rootRef}
      data-cursor-hover="false"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col flex-1 min-h-dvh bg-black text-white relative font-sans select-none lg:cursor-none"
    >
      <CursorEffects
        glowRef={glowRef}
        cursorRef={cursorRef}
        cursorBoxRef={cursorBoxRef}
      />

      <PixelGlowBackground randomPixels={randomPixels} />

      {showLanding && <LandingAmbientGlow />}

      <SiteHeader onLogoClick={handleReset} />

      <main className="flex flex-col flex-1 justify-center items-center relative z-10 px-6 py-12 max-w-6xl w-full mx-auto min-h-0">
        {showLanding && (
          <LandingView
            isCut={isCut}
            showPixels={showPixels}
            transitionPixels={transitionPixels}
            repoUrl={repoUrl}
            onRepoUrlChange={setRepoUrl}
            onSubmit={handleSubmit}
            error={error}
            isLoading={isLoading}
          />
        )}

        {isLoading && (
          <LoadingTerminal
            repoUrl={repoUrl}
            loadingStepIndex={loadingStepIndex}
          />
        )}

        {!isLoading && storyData && (
          <StoryWorkstation
            storyData={storyData}
            isLightMode={isLightMode}
            setIsLightMode={setIsLightMode}
            onReset={handleReset}
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
