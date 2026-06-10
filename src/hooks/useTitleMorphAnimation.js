"use client";

import { useState, useEffect } from "react";

export function useTitleMorphAnimation() {
  const [isCut, setIsCut] = useState(false);
  const [showPixels, setShowPixels] = useState(false);
  const [transitionPixels, setTransitionPixels] = useState([]);

  useEffect(() => {
    let spawnInterval;
    let cleanupInterval;

    const startSpawningTimeout = setTimeout(() => {
      setShowPixels(true);
      spawnInterval = setInterval(() => {
        setTransitionPixels((prev) => {
          const now = Date.now();
          const newPixels = Array.from({ length: 3 }).map(() => ({
            id: Math.random().toString(),
            col: Math.floor(Math.random() * 40),
            row: Math.floor(Math.random() * 10),
            isGreen: Math.random() > 0.45,
            createdAt: now,
          }));
          const filtered = prev.filter((p) => now - p.createdAt < 300);
          return [...filtered, ...newPixels].slice(-24);
        });
      }, 50);
    }, 400);

    const textTimeout = setTimeout(() => {
      setIsCut(true);
    }, 700);

    const stopSpawningTimeout = setTimeout(() => {
      clearInterval(spawnInterval);

      cleanupInterval = setInterval(() => {
        const now = Date.now();
        setTransitionPixels((prev) => {
          const filtered = prev.filter((p) => now - p.createdAt < 300);
          if (filtered.length === 0) {
            clearInterval(cleanupInterval);
            setShowPixels(false);
          }
          return filtered;
        });
      }, 15);
    }, 1000);

    return () => {
      clearTimeout(startSpawningTimeout);
      clearTimeout(textTimeout);
      clearTimeout(stopSpawningTimeout);
      clearInterval(spawnInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  return { isCut, showPixels, transitionPixels };
}
