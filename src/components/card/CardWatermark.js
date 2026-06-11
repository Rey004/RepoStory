export default function CardWatermark({ isLightMode, themeColor = "#00ff66" }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      <svg
        className="w-64 h-64"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: `${themeColor}0d` }}
      >
        <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <rect x="12" y="12" width="8" height="8" fill="currentColor" />
      </svg>
    </div>
  );
}
