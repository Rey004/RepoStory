"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export function GenerateButton({
  hue = 144, // Green hue instead of blue/purple (matches RepoStory's neon green)
  isGenerating: controlledIsGenerating,
  className,
  onClick,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  
  const isGenerating = controlledIsGenerating !== undefined ? controlledIsGenerating : isFocused;

  return (
    <div className="relative inline-block group">
      <style>{`
        .gen-btn {
          --border-radius: 9999px;
          --transition: 0.25s ease;
          --highlight-color-hue: ${hue}deg;

          user-select: none;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.6rem 1.4rem;
          font-family: var(--font-sans), sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: var(--border-radius);
          cursor: pointer;
          border: 1px solid #ffffff;
          background-color: #ffffff;
          color: #000000;
          transition: all var(--transition);
        }

        .gen-btn-svg {
          flex-shrink: 0;
          height: 14px;
          width: 14px;
          margin-right: 0.4rem;
          fill: #000000;
          transition: fill var(--transition);
        }

        .gen-btn-letter {
          position: relative;
          display: inline-block;
          color: #000000;
          transition: color var(--transition);
        }

        .gen-txt-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 5.5em;
          height: 100%;
        }

        .gen-txt-1,
        .gen-txt-2 {
          position: absolute;
          display: flex;
        }

        .gen-txt-1 {
          opacity: 1;
          transition: opacity var(--transition);
        }

        .gen-txt-2 {
          opacity: 0;
          transition: opacity var(--transition);
        }

        /* Hover state */
        .gen-btn:hover:not([data-generating="true"]) {
          background-color: #f4f4f5;
          border-color: #f4f4f5;
          transform: scale(1.02);
        }
        
        .gen-btn:active:not([data-generating="true"]) {
          transform: scale(0.98);
        }

        /* Generating (Focus/Active) state - Native clean loader */
        .gen-btn[data-generating="true"] {
          background-color: #ffffff;
          border-color: #e4e4e7;
          color: #000000;
          cursor: wait;
        }

        .gen-btn[data-generating="true"] .gen-btn-svg {
          fill: #000000;
          animation: gen-flicker 1.2s linear infinite;
        }

        @keyframes gen-flicker {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .gen-btn[data-generating="true"] .gen-txt-1 {
          opacity: 0;
          pointer-events: none;
        }

        .gen-btn[data-generating="true"] .gen-txt-2 {
          opacity: 1;
        }

        .gen-btn[data-generating="true"] .gen-btn-letter {
          color: #000000;
          animation: gen-letter-pulse 1.5s ease-in-out infinite;
        }

        @keyframes gen-letter-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; text-shadow: 0 0 4px rgba(0, 0, 0, 0.15); }
        }

        /* Animation delays for letters */
        .gen-btn-letter:nth-child(1) { animation-delay: 0s; }
        .gen-btn-letter:nth-child(2) { animation-delay: 0.08s; }
        .gen-btn-letter:nth-child(3) { animation-delay: 0.16s; }
        .gen-btn-letter:nth-child(4) { animation-delay: 0.24s; }
        .gen-btn-letter:nth-child(5) { animation-delay: 0.32s; }
        .gen-btn-letter:nth-child(6) { animation-delay: 0.40s; }
        .gen-btn-letter:nth-child(7) { animation-delay: 0.48s; }
        .gen-btn-letter:nth-child(8) { animation-delay: 0.56s; }
        .gen-btn-letter:nth-child(9) { animation-delay: 0.64s; }
        .gen-btn-letter:nth-child(10) { animation-delay: 0.72s; }
        .gen-btn-letter:nth-child(11) { animation-delay: 0.80s; }
        .gen-btn-letter:nth-child(12) { animation-delay: 0.88s; }
        .gen-btn-letter:nth-child(13) { animation-delay: 0.96s; }
      `}</style>

      <button
        type="submit"
        className={cn("gen-btn", className)}
        data-generating={isGenerating}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={(e) => {
          setIsFocused(true);
          onClick?.(e);
        }}
        {...props}
      >
        <svg className="gen-btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"></path>
        </svg>

        <div className="gen-txt-wrapper">
          <div className="gen-txt-1">
            {"Generate".split("").map((letter, i) => (
              <span key={`t1-${i}`} className="gen-btn-letter">{letter}</span>
            ))}
          </div>
          <div className="gen-txt-2">
            {"Generating".split("").map((letter, i) => (
              <span key={`t2-${i}`} className="gen-btn-letter">{letter}</span>
            ))}
          </div>
        </div>
      </button>
    </div>
  );
}

export default GenerateButton;
