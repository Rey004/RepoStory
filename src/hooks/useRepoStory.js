"use client";

import { useState, useEffect } from "react";
import { LOADING_STEPS } from "@/constants/loadingSteps";

export function useRepoStory() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [storyData, setStoryData] = useState(null);
  const [error, setError] = useState(null);
  const [isLightMode, setIsLightMode] = useState(false);

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

  return {
    repoUrl,
    setRepoUrl,
    isLoading,
    loadingStepIndex,
    storyData,
    error,
    isLightMode,
    setIsLightMode,
    handleSubmit,
    handleReset,
  };
}
