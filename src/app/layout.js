import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RepoStory | Turn Your GitHub Repo into a Shareable Story",
  description: "Transform any GitHub repository into a beautifully designed, shareable story card. Analyze project growth, technology stack, milestone timeline, and developer archetype.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
