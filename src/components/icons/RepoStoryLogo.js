export default function RepoStoryLogo({ className = "w-7 h-7" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect
        x="6"
        y="6"
        width="20"
        height="20"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      <rect x="13" y="13" width="6" height="6" fill="currentColor" />
    </svg>
  );
}
