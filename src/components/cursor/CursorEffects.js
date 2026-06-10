export default function CursorEffects({ glowRef, cursorRef, cursorBoxRef }) {
  return (
    <div className="cursor-effects-layer hidden lg:block" aria-hidden="true">
      <div ref={glowRef} data-active="false" className="cursor-glow" />
      <div ref={cursorRef} className="custom-cursor">
        <div className="custom-cursor-dot absolute w-1.5 h-1.5 bg-[#00ff66]" />
        <svg
          className="custom-cursor-arrow absolute w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
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
  );
}
