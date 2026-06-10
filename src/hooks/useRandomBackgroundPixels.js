"use client";

import { useState, useEffect } from "react";

export function useRandomBackgroundPixels(groupCount = 8) {
  const [randomPixels, setRandomPixels] = useState([]);

  useEffect(() => {
    const groups = Array.from({ length: groupCount }).map((_, idx) => {
      const isLeft = idx % 2 === 0;
      const leftVal = isLeft
        ? Math.random() * 16 + 2
        : Math.random() * 16 + 82;

      const pixels = Array.from({ length: 9 }).map(() => ({
        visible: Math.random() > 0.55,
        animType: Math.floor(Math.random() * 3) + 1,
      }));

      return {
        id: Math.random().toString(),
        top: `${Math.random() * 90 + 5}%`,
        left: `${leftVal}%`,
        opacity: Math.random() * 0.05 + 0.10,
        pixels,
      };
    });
    setRandomPixels(groups);
  }, [groupCount]);

  return randomPixels;
}
