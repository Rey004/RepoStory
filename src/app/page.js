"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  ArrowLeft, 
  Terminal, 
  AlertCircle,
  Sparkles,
  Heart
} from "lucide-react";
import RepoStoryCard from "@/components/RepoStoryCard";
import ExportControls from "@/components/ExportControls";
import GenerateButton from "@/components/GenerateButton";

// Custom Github Icon SVG Component
const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// Steps to simulate in the terminal loading view
const LOADING_STEPS = [
  "Establishing secure connection to api.github.com...",
  "Cloning repository metadata & headers...",
  "Parsing lines of code and language statistics...",
  "Aggregating contributor commits profiles...",
  "Analyzing commit timestamps & weekly patterns...",
  "Determining developer archetype classification...",
  "Assembling timeline milestones & release notes...",
  "Executing story narrative heuristic compilation...",
  "Finalizing visual story card assembly...",
  "Story compiled successfully!"
];
const PixelGlowBackground = ({ randomPixels = [] }) => (
  <div className="bg-effects-layer absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 grid-bg opacity-20" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.9)_3px,transparent_3px),linear-gradient(to_bottom,rgba(0,0,0,0.9)_3px,transparent_3px)] bg-[size:6px_6px] opacity-20" />

    <div className="absolute inset-0 pointer-events-none">
      {randomPixels.map((group) => (
        <div
          key={group.id}
          className="absolute pointer-events-none select-none"
          style={{
            top: group.top,
            left: group.left,
            opacity: group.opacity,
          }}
        >
          <div className="grid grid-cols-3 gap-1">
            {group.pixels.map((p, idx) => (
              p.visible ? (
                <div
                  key={idx}
                  className={`w-3 h-3 bg-[#00ff66] animate-pixel-${p.animType}`}
                />
              ) : null
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CardWrapper = ({ children, cardRef }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ scale: 1, height: 450 });

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current || !cardRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const cardHeight = cardRef.current.offsetHeight || cardRef.current.scrollHeight || 450;
      
      const newScale = containerWidth < 650 ? containerWidth / 650 : 1;
      setDimensions({
        scale: newScale,
        height: cardHeight * newScale
      });
    };

    const timer = setTimeout(updateDimensions, 100);

    window.addEventListener("resize", updateDimensions);
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
      resizeObserver.disconnect();
    };
  }, [cardRef]);

  return (
    <div ref={containerRef} className="w-full flex flex-col justify-start items-center overflow-hidden">
      <div 
        style={{
          width: "650px",
          height: `${dimensions.height}px`,
          position: "relative",
        }}
        className="flex justify-center items-start"
      >
        <div 
          style={{
            transform: `scale(${dimensions.scale})`,
            transformOrigin: "top center",
            width: "650px",
            position: "absolute",
            top: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [storyData, setStoryData] = useState(null);
  const [error, setError] = useState(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [showPixels, setShowPixels] = useState(false);
  const [transitionPixels, setTransitionPixels] = useState([]); // State for random text morph transition pixels
  const [randomPixels, setRandomPixels] = useState([]); // State for scattered ambient background pixels

  const cardRef = useRef(null);
  const rootRef = useRef(null);
  const glowRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorBoxRef = useRef(null);
  const mouseRafRef = useRef(null);
  const isHoveringRef = useRef(false);
  const pendingMouseRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mouseRafRef.current) {
        cancelAnimationFrame(mouseRafRef.current);
      }
    };
  }, []);

  // Generate random background pixel groups on mount
  useEffect(() => {
    const groups = Array.from({ length: 8 }).map((_, idx) => {
      // Alternate between left and right sides of the page
      const isLeft = idx % 2 === 0;
      const leftVal = isLeft 
        ? Math.random() * 16 + 2  // 2% to 18%
        : Math.random() * 16 + 82; // 82% to 98%
        
      // Generate a 3x3 pixel cluster layout (each group has some cells visible)
      const pixels = Array.from({ length: 9 }).map(() => ({
        visible: Math.random() > 0.55, // ~45% chance of cell being active
        animType: Math.floor(Math.random() * 3) + 1,
      }));

      return {
        id: Math.random().toString(),
        top: `${Math.random() * 90 + 5}%`,
        left: `${leftVal}%`,
        opacity: Math.random() * 0.05 + 0.10, // balanced opacity (10% to 15%)
        pixels,
      };
    });
    setRandomPixels(groups);
  }, []);



  const handleMouseMove = useCallback((e) => {
    pendingMouseRef.current = e;

    if (mouseRafRef.current) return;

    mouseRafRef.current = requestAnimationFrame(() => {
      mouseRafRef.current = null;
      const event = pendingMouseRef.current;
      if (!event || !rootRef.current) return;

      const x = event.clientX;
      const y = event.clientY;
      const position = `translate3d(${x}px, ${y}px, 0)`;

      if (glowRef.current) {
        glowRef.current.style.transform = `${position} translate(-50%, -50%)`;
        glowRef.current.dataset.active = "true";
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = position;
      }
      if (cursorBoxRef.current) {
        cursorBoxRef.current.style.transform = `${position} translate(-50%, -50%)`;
      }

      const target = event.target;
      const isInteractive = !!(
        target?.closest("a") ||
        target?.closest("button") ||
        target?.closest("[role='button']") ||
        target?.closest(".cursor-pointer") ||
        target?.closest("input") ||
        target?.closest("select")
      );

      if (isInteractive !== isHoveringRef.current) {
        isHoveringRef.current = isInteractive;
        rootRef.current.dataset.cursorHover = isInteractive ? "true" : "false";
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (mouseRafRef.current) {
      cancelAnimationFrame(mouseRafRef.current);
      mouseRafRef.current = null;
    }
    isHoveringRef.current = false;
    if (rootRef.current) {
      rootRef.current.dataset.cursorHover = "false";
    }
    if (glowRef.current) {
      glowRef.current.dataset.active = "false";
    }
  }, []);

  // One-time text-morph pixelated transition animation on mount using random trail logic
  useEffect(() => {
    let spawnInterval;
    let cleanupInterval;
    
    // Start spawning random pixels after 400ms
    const startSpawningTimeout = setTimeout(() => {
      setShowPixels(true);
      spawnInterval = setInterval(() => {
        setTransitionPixels((prev) => {
          const now = Date.now();
          const newPixels = Array.from({ length: 3 }).map(() => ({
            id: Math.random().toString(),
            col: Math.floor(Math.random() * 40),
            row: Math.floor(Math.random() * 10),
            isGreen: Math.random() > 0.45,
            createdAt: now,
          }));
          const filtered = prev.filter((p) => now - p.createdAt < 300);
          return [...filtered, ...newPixels].slice(-24);
        });
      }, 50);
    }, 400);

    // Swap text at 700ms (when pixel density is highest)
    const textTimeout = setTimeout(() => {
      setIsCut(true);
    }, 700);

    // Stop spawning new pixels at 1000ms and cleanup remaining trail
    const stopSpawningTimeout = setTimeout(() => {
      clearInterval(spawnInterval);
      
      cleanupInterval = setInterval(() => {
        const now = Date.now();
        setTransitionPixels((prev) => {
          const filtered = prev.filter((p) => now - p.createdAt < 300);
          if (filtered.length === 0) {
            clearInterval(cleanupInterval);
            setShowPixels(false);
          }
          return filtered;
        });
      }, 15);
    }, 1000);

    return () => {
      clearTimeout(startSpawningTimeout);
      clearTimeout(textTimeout);
      clearTimeout(stopSpawningTimeout);
      clearInterval(spawnInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  // Cycle through loading steps during fetch
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => {
          if (prev < LOADING_STEPS.length - 2) {
            return prev + 1;
          }
          return prev;
        });
      }, 900);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const fetchRepoStory = async (urlToFetch) => {
    const targetUrl = urlToFetch || repoUrl;
    if (!targetUrl) return;

    setIsLoading(true);
    setError(null);
    setStoryData(null);

    try {
      const response = await fetch(`/api/repo?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch repository story.");
      }

      // Ensure last loading steps display before rendering
      setLoadingStepIndex(LOADING_STEPS.length - 1);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStoryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRepoStory();
  };

  const handleReset = () => {
    setStoryData(null);
    setRepoUrl("");
    setError(null);
  };

  return (
    <div
      ref={rootRef}
      data-cursor-hover="false"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col flex-1 min-h-dvh bg-black text-white relative font-sans select-none lg:cursor-none"
    >
      {/* Cursor effects — fixed + clipped to viewport so glow never extends scroll height */}
      <div
        className="cursor-effects-layer hidden lg:block"
        aria-hidden="true"
      >
        <div
          ref={glowRef}
          data-active="false"
          className="cursor-glow"
        />
        <div ref={cursorRef} className="custom-cursor">
          <div className="custom-cursor-dot absolute w-1.5 h-1.5 bg-[#00ff66]" />
          <svg
            className="custom-cursor-arrow absolute w-[18px] h-[18px]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M0 0v16l4.5-4.5 3.5 7 2.5-1.5-3.5-7H12Z"
              fill="#00ff66"
              stroke="#000000"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          ref={cursorBoxRef}
          className="custom-cursor-box w-6 h-6 border"
          style={{ borderColor: "rgba(0, 255, 102, 0.35)" }}
        />
      </div>

      <PixelGlowBackground randomPixels={randomPixels} />

      {/* Viewport-Aligned Sidebar Decorators (Landing page only) */}
      {!storyData && (
        <>
          <div className="absolute left-0 top-1/6 bottom-1/6 w-24 md:w-48 bg-gradient-to-r from-[#00ff66]/18 to-transparent blur-3xl pointer-events-none z-0" />
          <div className="absolute right-0 top-1/6 bottom-1/6 w-24 md:w-48 bg-gradient-to-l from-[#00ff66]/18 to-transparent blur-3xl pointer-events-none z-0" />

          <div
            className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, rgba(0, 255, 102, 0.12) 0%, transparent 65%)`,
            }}
          />


        </>
      )}

      {/* Header Branding (Transparent) */}
      <header className="bg-transparent relative z-50 w-full animate-slide-down">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            {/* Header logo: custom vector-based square cursor logo */}
            <div className="w-10 h-10 flex items-center justify-center bg-transparent rounded-none border-none shadow-none text-[#00ff66] transition-transform duration-300 hover:scale-110 hover:rotate-12">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Glowing neon outer square cursor box */}
                <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" stroke-width="2.5" fill="none" style={{ filter: "drop-shadow(0 0 5px rgba(0, 255, 102, 0.5))" }} />
                {/* Inner solid square dot */}
                <rect x="13" y="13" width="6" height="6" fill="currentColor" />
              </svg>
            </div>
            <span className="font-display text-lg font-light tracking-wider">
              RepoStory<span className="text-[#00ff66]">.</span>
            </span>
          </div>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-800 text-sm text-zinc-400 hover:text-white hover:border-zinc-700 bg-black transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-col flex-1 justify-center items-center relative z-10 px-6 py-12 max-w-6xl w-full mx-auto min-h-0">
        
        {/* State 1: Search Form & Intro */}
        {!isLoading && !storyData && (
          <div className="w-full max-w-4xl flex flex-col items-center text-center gap-6 py-8 relative z-10">


            <div className="flex flex-col items-center gap-4 w-full">
              
              {/* Brand tagline pill (Glassmorphism, minimal border, no glow) */}
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[#00ff66] text-xs w-fit mx-auto animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
                <span>Transform Repos into Social Story Cards</span>
              </div>

              {/* Slicing Brand Text Morph (Repository -> RepoStory) - Minimal, less weight, no glow */}
              <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light font-display text-center tracking-tight select-none animate-fade-in-delay-100">
                <span className="relative inline-grid grid-cols-1 grid-rows-1 justify-items-center items-center px-4 py-1">
                  {/* Repository text */}
                  <span 
                    className={`col-start-1 row-start-1 inline-block transition-opacity duration-300 text-zinc-500 font-light ${
                      isCut ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    Repository
                  </span>
                  {/* morphing RepoStory text */}
                  <span 
                    className={`col-start-1 row-start-1 font-medium text-white transition-opacity duration-300 ${
                      isCut ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    RepoStory<span className="text-[#00ff66]">.</span>
                  </span>
                  {/* Pixelated Transition Overlay Grid (Dynamic Random Trail) */}
                  {showPixels && (
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                      {transitionPixels.map((p) => (
                        <div 
                          key={p.id}
                          className={`absolute animate-trans-pixel ${
                            p.isGreen ? "bg-[#00ff66]" : "bg-[#0a0a0c]"
                          }`}
                          style={{
                            left: `${p.col * 2.5}%`,
                            top: `${p.row * 10}%`,
                            width: "2.5%",
                            height: "10%",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </span>
              </div>

              {/* URL Input Form (Rounded Full, no glow shadow) */}
              <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto my-2 animate-fade-in-delay-200">
                <div className="relative group rounded-3xl sm:rounded-full bg-zinc-950 border border-zinc-850 focus-within:border-[#00ff66] transition-all p-1.5 sm:p-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pl-3 sm:pl-4 pr-1.5 sm:pr-1 shadow-none w-full">
                  <div className="flex-1 flex items-center gap-2 py-1 sm:py-0">
                    <GithubIcon className="w-4 h-4 text-zinc-550 shrink-0" />
                    <input
                      id="repo-url-input"
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="GitHub repository URL (e.g. facebook/react)"
                      className="flex-1 bg-transparent text-xs focus:outline-none placeholder-zinc-650 py-1.5 sm:py-2 text-white"
                      required
                    />
                  </div>
                  <GenerateButton
                    id="generate-btn"
                    isGenerating={isLoading}
                    className="shrink-0 scale-95 sm:scale-100"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 mt-4 p-3 rounded-full border border-red-900 bg-red-950/30 text-red-400 text-xs font-mono text-left px-5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </form>

              {/* Description & Pipeline Layout Split */}
              <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch mt-2 animate-fade-in-delay-300">
                {/* Description of what the tool does */}
                <div className="flex-1 border border-zinc-900/50 rounded-lg bg-zinc-950/20 hover:bg-zinc-950/40 hover:border-zinc-800/80 p-4.5 font-sans text-xs text-zinc-400 flex flex-col justify-center text-left relative overflow-hidden shadow-sm transition-colors duration-300">
                  
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-xs font-semibold text-white uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
                      What is RepoStory?
                    </h3>
                    <p className="leading-relaxed text-zinc-300 text-xs font-light">
                      RepoStory compiles commits, technology stats, and milestone chronologies from any public GitHub repository into a beautifully styled, shareable visual card.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Milestones', 'Developer Archetype', 'Stack Insights'].map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full border border-zinc-900 bg-zinc-950/60 text-[10px] text-zinc-400 font-sans tracking-wide">
                          ✦ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Unique Techy Hero Status Layout */}
                <div className="flex-1 border border-zinc-900/50 rounded-lg bg-zinc-950/20 hover:bg-zinc-950/40 hover:border-zinc-800/80 p-4.5 font-mono text-[11px] text-zinc-400 text-left relative overflow-hidden shadow-sm flex flex-col justify-between transition-colors duration-300">
                  <div>
                    {/* Console header */}
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-zinc-900/60">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]"></span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-650">analysis_pipeline.sh</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-between">
                      <div className="flex-1 min-w-[180px]">
                        <p className="text-[#00ff66]/90"><span className="text-zinc-700">&gt;</span> repository.analyze()</p>
                        <p className="pl-3.5 text-zinc-300 leading-normal font-light mt-1">"Your repository is more than its commits."</p>
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <p className="text-[#00ff66]/90"><span className="text-zinc-700">&gt;</span> social_cards.compile()</p>
                        <div className="pl-3.5 flex flex-wrap gap-1.5 pt-1.5">
                          {['DNA_DECODER', 'MILESTONES', 'TECH_STACKS', 'SOCIAL_CARDS'].map((feature, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded border border-zinc-850 bg-zinc-900/40 text-[9px] text-zinc-550 font-mono tracking-wide">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* State 2: Terminal Loading State */}
        {isLoading && (
          <div className="w-full max-w-xl p-5 rounded-lg border border-[#00ff66]/20 bg-[#040705] shadow-2xl relative font-mono text-xs">
            {/* Window bar */}
            <div className="flex justify-between items-center pb-3 border-b border-zinc-900 mb-4 text-zinc-550">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
                <span className="text-[10px]">repo-analyzer.sh</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
              </div>
            </div>

            {/* Command line */}
            <div className="flex gap-1.5 mb-3 text-zinc-400">
              <span className="text-[#00ff66]">$</span>
              <span>./repo-story --target={repoUrl || "analyzing..."}</span>
            </div>

            {/* Simulated log outputs */}
            <div className="flex flex-col gap-2 min-h-[160px] max-h-[260px] overflow-y-auto pr-2">
              {LOADING_STEPS.slice(0, loadingStepIndex + 1).map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2 ${
                    idx === loadingStepIndex ? "text-[#00ff66]" : "text-zinc-550"
                  }`}
                >
                  <span className="select-none">✓</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            
            {/* Blinking cursor */}
            <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-650">
              <span>ANALYZER ACTIVE</span>
              <span className="w-2 h-4 bg-[#00ff66] animate-pulse" />
            </div>
          </div>
        )}

        {/* State 3: Active Card Workstation */}
        {!isLoading && storyData && (
          <div className="w-full flex flex-col gap-6 animate-fade-in">
            {/* Back action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-950 pb-4">
              <button
                id="back-to-input-btn"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-mono rounded-full border border-zinc-850 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Analyze Another Repo</span>
              </button>
              <div className="text-xs font-mono text-zinc-500">
                Story for: <span className="text-zinc-350 font-medium">{storyData.githubData.repoDetails.fullName}</span>
              </div>
            </div>

            {/* Customizer / Story layout split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Card Workspace (Takes 2 columns on large screens) */}
              <div className="lg:col-span-2 flex justify-center py-2 relative w-full overflow-hidden">
                <CardWrapper cardRef={cardRef}>
                  <RepoStoryCard 
                    data={storyData} 
                    cardRef={cardRef} 
                    isLightMode={isLightMode} 
                  />
                </CardWrapper>
              </div>

              {/* Customize & Actions panel */}
              <div className="lg:col-span-1">
                <ExportControls
                  cardRef={cardRef}
                  isLightMode={isLightMode}
                  setIsLightMode={setIsLightMode}
                  repoName={storyData.githubData.repoDetails.name}
                  ownerName={storyData.githubData.repoDetails.owner.login}
                />
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-6 mt-auto shrink-0 text-xs font-mono text-zinc-400 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RepoStory.</p>
          <p className="flex items-center gap-1.5 text-zinc-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#00ff66] fill-[#00ff66] animate-pulse" />
            <span>by</span>
            <a 
              href="https://revanshu-portfolio.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-[#00ff66] transition-colors underline decoration-zinc-800 hover:decoration-[#00ff66] underline-offset-4"
            >
              Revanshu
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
