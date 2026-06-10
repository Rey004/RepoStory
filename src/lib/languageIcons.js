const LANG_TO_DEVICON = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  Java: "java",
  Go: "go",
  Rust: "rust",
  Ruby: "ruby",
  PHP: "php",
  "C++": "cplusplus",
  "C#": "csharp",
  C: "c",
  Swift: "swift",
  Kotlin: "kotlin",
  Dart: "dart",
  Scala: "scala",
  Shell: "bash",
  HTML: "html5",
  CSS: "css3",
  SCSS: "sass",
  Vue: "vuejs",
  "Vue.js": "vuejs",
  React: "react",
  Svelte: "svelte",
  Astro: "astro",
  Elixir: "elixir",
  Haskell: "haskell",
  Lua: "lua",
  R: "r",
  MATLAB: "matlab",
  Objective: "apple",
  "Objective-C": "apple",
  Docker: "docker",
  Dockerfile: "docker",
  Jupyter: "jupyter",
  Markdown: "markdown",
};

export function getLanguageIconUrl(language) {
  const slug =
    LANG_TO_DEVICON[language] ||
    LANG_TO_DEVICON[language.replace(/\./g, "")] ||
    language.toLowerCase().replace(/[^a-z0-9+#]/gi, "");

  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`;
}

export function getLanguageList(languages, limit = 8) {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, bytes]) => ({
      name,
      percentage: totalBytes ? Math.round((bytes / totalBytes) * 100) : 0,
    }));
}
