# <p align="center"><img src="public/icon.svg" width="96" height="96" alt="RepoStory Logo" /></p>

<h1 align="center">RepoStory</h1>

<p align="center">
  <strong>Turn your GitHub repository stats into beautiful developer story cards.</strong>
</p>

<hr style="border: 1px solid #00ff66; opacity: 0.2;" />

## 📖 Description

**RepoStory** is a cyberpunk-themed web app that analyzes public GitHub repositories. It processes commits, languages, and releases to generate a customized **Trading-Card infographic** showcasing the project's developer archetype (e.g., *Solo Builder*, *Rising Star*) and commit habits (*Night Owl*, *Weekend Warrior*).

---

## ⚡ Features

*   **Dynamic Customization:** Choose custom colors (defaulting to neon green `#00ff66`) and toggle between Light and Dark mode.
*   **Easy Exporting:** Export cards as high-quality PNGs or copy them to your clipboard.
*   **Rich Analytics:** Includes milestone flowcharts, a commit activity grid, and language distributions.
*   **Gemini AI Summaries:** Optionally uses Google Gemini API to write witty, developer-focused stories about the repository.

---

## 🧠 Smart Profiling

### 🛡️ Archetypes

| Archetype | Badge | Icon | Description |
| :--- | :--- | :---: | :--- |
| **Solo Builder** | ![Solo Builder](https://img.shields.io/badge/Solo_Builder-00FF66?style=flat-square&logo=github&logoColor=030805) | 👤 | Crafted single-handedly by one developer. |
| **Rising Star** | ![Rising Star](https://img.shields.io/badge/Rising_Star-00FF66?style=flat-square&logo=github&logoColor=030805) | 🚀 | A new repository experiencing rapid adoption. |
| **Hidden Gem** | ![Hidden Gem](https://img.shields.io/badge/Hidden_Gem-00FF66?style=flat-square&logo=github&logoColor=030805) | 💎 | Highly useful utility with many forks, flying under the radar. |
| **Community Favorite** | ![Community Favorite](https://img.shields.io/badge/Community_Fav-00FF66?style=flat-square&logo=github&logoColor=030805) | 👥 | A bustling collaborative effort backed by multiple contributors. |
| **Legacy Giant** | ![Legacy Giant](https://img.shields.io/badge/Legacy_Giant-00FF66?style=flat-square&logo=github&logoColor=030805) | 🏛️ | Stable, mature, and battle-tested standard. |
| **Active Explorer** | ![Active Explorer](https://img.shields.io/badge/Active_Explorer-00FF66?style=flat-square&logo=github&logoColor=030805) | 🧭 | Steady progress with solid utility. |

### 🕒 Commit Habits

| Habit Pattern | Badge | Icon | Schedule |
| :--- | :--- | :---: | :--- |
| **Night Owl** | ![Night Owl](https://img.shields.io/badge/Night_Owl-00FF66?style=flat-square) | 🦉 | High activity between 11 PM and 5 AM. |
| **Early Bird** | ![Early Bird](https://img.shields.io/badge/Early_Bird-00FF66?style=flat-square) | 🌅 | Active during early morning hours. |
| **Daylight Developer** | ![Daylight Developer](https://img.shields.io/badge/Daylight_Dev-00FF66?style=flat-square) | ☀️ | Active during standard daytime business hours. |
| **Weekend Warrior** | ![Weekend Warrior](https://img.shields.io/badge/Weekend_Warrior-00FF66?style=flat-square) | ⚔️ | Commits heavily on Saturdays and Sundays. |
| **Office Hours Only** | ![Office Hours Only](https://img.shields.io/badge/Office_Hours-00FF66?style=flat-square) | 👔 | Commits exclusively during weekday business hours. |
| **Weekday Warrior** | ![Weekday Warrior](https://img.shields.io/badge/Weekday_Warrior-00FF66?style=flat-square) | 💻 | Active during the workweek with low weekend commits. |

---

## 🛠️ Local Setup Guide

### Prerequisites
*   <img src="https://img.shields.io/badge/Node.js-v18%2B-000000?style=flat-square&logo=nodedotjs&logoColor=00FF66" alt="Node.js" /> (v18+ recommended)
*   <img src="https://img.shields.io/badge/npm-v9%2B-000000?style=flat-square&logo=npm&logoColor=00FF66" alt="npm" />

### Steps

1. **Clone & Navigate:**
   ```bash
   git clone https://github.com/Rey004/RepoStory.git
   cd RepoStory
   ```

2. **Install:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root:
   ```env
   # Required to avoid rate limits (5,000 reqs/hr vs 60/hr)
   GITHUB_TOKEN=your_github_token_here

   # Optional: For AI-generated narratives
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Dev Server:**
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)**.

5. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🔑 GitHub API Rate Limits

| Auth Status | Rate Limit | Capacity | Badge | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Unauthenticated** | 60 requests / hr | ~5-6 repositories | ![Limit](https://img.shields.io/badge/Limit-60%2Fhr-red?style=flat-square) | Best for quick local tests. |
| **Authenticated** | 5,000 requests / hr | ~700 repositories | ![Limit](https://img.shields.io/badge/Limit-5000%2Fhr-00FF66?style=flat-square) | Required for standard use. |

---

## 🌟 Show Your Support

Please **give this repository a Star** if you like the project!

<p align="center">
  <a href="https://github.com/Rey004/RepoStory">
    <img src="https://img.shields.io/badge/⭐_STAR_THIS_REPO-000000?style=for-the-badge&logo=github&logoColor=00FF66&labelColor=121614" height="48" alt="Star RepoStory" />
  </a>
</p>

---

<p align="center">
  <sub>Built with 💚 by Revanshu</sub>
</p>
