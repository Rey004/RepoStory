"use client";

import { useState, useEffect, useCallback } from "react";
import { LOADING_STEPS } from "@/constants/loadingSteps";

export function useRepoStory() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [storyData, setStoryData] = useState(null);
  const [error, setError] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isTokenError, setIsTokenError] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [themeColor, setThemeColor] = useState("#00ff66");
  const [didAutoFetch, setDidAutoFetch] = useState(false);

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

  const fetchRepoStory = useCallback(async (urlToFetch) => {
    const targetUrl = urlToFetch || repoUrl;
    if (!targetUrl) return;

    setIsLoading(true);
    setError(null);
    setIsRateLimited(false);
    setIsTokenError(false);
    setStoryData(null);

    try {
      const response = await fetch(`/api/repo?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();

      // Detect rate limit by HTTP status or error message content
      const isRateLimit =
        response.status === 429 ||
        (data.error && /rate limit/i.test(data.error));
      const isTokenInvalid =
        response.status === 401 ||
        (data.error && /invalid or expired/i.test(data.error));

      if (!response.ok) {
        if (isRateLimit) setIsRateLimited(true);
        if (isTokenInvalid) setIsTokenError(true);
        throw new Error(data.error || "Failed to fetch repository story.");
      }

      setLoadingStepIndex(LOADING_STEPS.length - 1);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStoryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [repoUrl]);

  // Read URL query params on mount for shareable links
  useEffect(() => {
    if (didAutoFetch) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    const accentParam = params.get("accent");

    if (accentParam) {
      // Accept hex colors with or without #
      const color = accentParam.startsWith("#") ? accentParam : `#${accentParam}`;
      if (/^#[0-9a-fA-F]{6}$/.test(color)) {
        setThemeColor(color);
      }
    }

    if (urlParam) {
      setRepoUrl(urlParam);
      setDidAutoFetch(true);
      fetchRepoStory(urlParam);
    }
  }, [didAutoFetch, fetchRepoStory]);

  // Sync URL query params when storyData or themeColor changes
  const updateShareUrl = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!storyData || !repoUrl) return;

    const params = new URLSearchParams();
    params.set("url", repoUrl);
    if (themeColor && themeColor !== "#00ff66") {
      params.set("accent", themeColor.replace("#", ""));
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [storyData, repoUrl, themeColor]);

  useEffect(() => {
    updateShareUrl();
  }, [updateShareUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRepoStory();
  };

  const handleReset = () => {
    setStoryData(null);
    setRepoUrl("");
    setError(null);
    setIsRateLimited(false);
    setIsTokenError(false);
    // Clear query params on reset
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  };

  return {
    repoUrl,
    setRepoUrl,
    isLoading,
    loadingStepIndex,
    storyData,
    error,
    isRateLimited,
    isTokenError,
    isLightMode,
    setIsLightMode,
    themeColor,
    setThemeColor,
    handleSubmit,
    handleReset,
  };
}
