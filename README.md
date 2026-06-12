# <p align="center"><img src="public/icon.svg" width="96" height="96" alt="RepoStory Logo" /></p>

<h1 align="center">🟩 RepoStory</h1>

<p align="center">
  <strong>Turn your GitHub repository statistics into gorgeous, interactive developer stories.</strong>
</p>

<p align="center">
  <a href="https://github.com/Rey004/RepoStory/stargazers"><img src="https://img.shields.io/github/stars/Rey004/RepoStory?style=for-the-badge&color=00FF66&logoColor=030805" alt="Stars"></a>
  <a href="https://github.com/Rey004/RepoStory/network/members"><img src="https://img.shields.io/github/forks/Rey004/RepoStory?style=for-the-badge&color=00FF66&logoColor=030805" alt="Forks"></a>
  <a href="https://github.com/Rey004/RepoStory/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Rey004/RepoStory?style=for-the-badge&color=00FF66&logoColor=030805" alt="License"></a>
  <br />
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=00FF66" alt="Next.js">
  <img src="https://img.shields.io/badge/TailwindCSS-v4-000000?style=for-the-badge&logo=tailwindcss&logoColor=00FF66" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Gemini_AI-Enabled-0058A3?style=for-the-badge&logo=googlegemini&logoColor=00FF66" alt="Gemini AI">
</p>

<hr style="border: 1px solid #00ff66; opacity: 0.2;" />

## 📖 Short Description

**RepoStory** is a retro-futuristic, cyberpunk-themed web application built with Next.js and TailwindCSS. It parses any public GitHub repository to analyze commit timelines, language distributions, contribution behaviors, and release frequencies.

Using custom heuristics or **Google's Gemini AI**, RepoStory distills this complex data into a highly visual, beautifully styled **Trading-Card-Style Infographic**. It automatically profiles the project's developer archetype (e.g., *Solo Builder*, *Rising Star*, *Legacy Giant*) and commit schedules (*Night Owl*, *Weekend Warrior*), allowing you to customize the card's theme and export it instantly.

---

## ⚡ Features

### 🎮 Customization & Workstation
*   **Dynamic Theme Engine:** Instantly toggle between Light Mode and Dark Mode, and customize the accent color picker (defaulting to the cyberpunk neon green `#00ff66`).
*   **Export controls:** Download your customized repository card as a high-quality PNG image, share it, or copy it directly to your clipboard.

### 🧠 Smart Profiling & Analysis
*   **Archetype Engine:** Detects the development persona of the repository:
    *   `Solo Builder` 👤 – A single developer crafting their vision independently.
    *   `Rising Star` 🚀 – A young repository experiencing explosive adoption.
    *   `Hidden Gem` 💎 – High utility with many forks, flying under the mainstream radar.
    *   `Community Favorite` 👥 – A collaborative powerhouse backed by a community.
    *   `Legacy Giant` 🏛️ – A mature, battle-tested standard that rarely needs changes.
    *   `Active Explorer` 🧭 – A solid utility steadily forging its own path.
*   **Commit Patterns:** Analyzes exact timestamps of commits to classify the developer mindset:
    *   *Night Owl* 🦉 vs. *Early Bird* 🌅 vs. *Daylight Developer* ☀️
    *   *Weekend Warrior* ⚔️ vs. *Office Hours Only* 👔 vs. *Weekday Warrior* 💻

### 📊 Rich Visualizations
*   **Milestone Flowchart:** An interactive timeline charting important repository history, version releases, and major commit phases.
*   **Contribution Grid:** A styled 7-day commit activity heatmap that matches GitHub's signature contribution style, themed in your card's color.
*   **Top Language Pills & Statistics:** Highlights accurate counts of open issues (excluding PRs), contributors, total commits, and codebase languages.

### 🤖 Gemini AI Narrative (Optional)
*   If a Gemini API Key is provided, RepoStory acts as a **witty developer-sociologist**, writing a customized, punchy, and slightly humorous 3-4 sentence story summary highlighting the repository's habits. Otherwise, it seamlessly falls back to a clean local heuristic story generator.

---

## 🛠️ Local Setup Guide

Follow these steps to run RepoStory on your local machine:

### Prerequisites
*   [Node.js](https://nodejs.org/) (version **18.0.0** or higher is recommended)
*   [npm](https://www.npmjs.com/) (installed automatically with Node)

### Installation Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Rey004/RepoStory.git
    cd RepoStory
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env` file (or copy from the configuration guides below) in the root directory:
    ```bash
    # For Windows command line
    type NUL > .env
    
    # For macOS/Linux/Git Bash
    touch .env
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)** to see the app running!

5.  **Build for Production:**
    To build the production bundle:
    ```bash
    npm run build
    npm run start
    ```

---

## 🔑 Configuration & Rate Limits

RepoStory relies on the GitHub REST API. Because it fetches rich data (metadata, languages, releases, contributors, commits, pulls, etc.), it can trigger rate limit caps.

### 🛡️ Understanding GitHub API Rate Limits
*   **Unauthenticated Requests:** GitHub limits unauthenticated requests to **60 requests per hour** per IP address. Analyzing just 5-6 average repositories can quickly hit this limit.
*   **Authenticated Requests:** By adding a GitHub Personal Access Token (PAT), your limit is raised to **5,000 requests per hour**, allowing thousands of seamless repository reports.

### ⚙️ Setting Up Your Tokens
Open your `.env` (or `.env.local`) file and add the following keys:

```env
# 1. GitHub Personal Access Token (No special permissions needed for public repos!)
GITHUB_TOKEN=your_github_personal_access_token_here

# 2. Google Gemini API Key (Optional - for AI-generated summaries)
GEMINI_API_KEY=your_gemini_api_key_here
```

#### How to create a GitHub PAT:
1. Go to your GitHub account settings: **Settings > Developer Settings > Personal Access Tokens > Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Add a note (e.g., `RepoStory-App`).
4. **Do NOT select any scopes** (unscoped tokens are perfectly sufficient to read public repositories, keeping your account highly secure).
5. Click **Generate token** and copy the resulting string into `GITHUB_TOKEN` in your `.env` file.

#### How to create a Gemini API Key:
1. Go to the [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** and create a key in a new or existing Google Cloud project.
3. Copy the key and paste it as `GEMINI_API_KEY` in your `.env` file.

---

## 🎨 Green Cyberpunk Theme

The application's premium retro-cyberpunk aesthetic is styled using custom animations, scanline grids, and glowing filters:
*   **Primary Palette:** Background `#030303` (deep black) contrasted with `#00ff66` (neon matrix-green).
*   **Interactive Cursor:** A custom box-and-dot green cursor that morphs and glows when hovering over buttons.
*   **Ambient Glow:** A radial-gradient light background that flickers and reacts as the repository loading terminal processes data.

---

## 🌟 Show Your Support

If you like RepoStory and want to support its development, please consider **giving this repository a Star!** It helps other developers discover the project and keeps the creators motivated.

<p align="center">
  <a href="https://github.com/Rey004/RepoStory">
    <img src="https://img.shields.io/badge/⭐_STAR_THIS_REPO-000000?style=for-the-badge&logo=github&logoColor=00FF66&labelColor=121614" height="48" alt="Star RepoStory" />
  </a>
</p>

---

<p align="center">
  <sub>Built with 💚 by Revanshu</sub>
</p>
