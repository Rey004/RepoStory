"use client";

import { useState, useEffect, useRef } from "react";

export default function CardWrapper({ children, cardRef, cardWidth = 760 }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ scale: 1, height: 450 });

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current || !cardRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const cardHeight = cardRef.current.offsetHeight || cardRef.current.scrollHeight || 450;

      const newScale = containerWidth < cardWidth ? containerWidth / cardWidth : 1;
      setDimensions({
        scale: newScale,
        height: cardHeight * newScale,
      });
    };

    const timer = setTimeout(updateDimensions, 100);

    window.addEventListener("resize", updateDimensions);

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
      resizeObserver.disconnect();
    };
  }, [cardRef, cardWidth]);

  return (
    <div ref={containerRef} className="w-full flex flex-col justify-start items-center overflow-hidden">
      <div
        style={{
          width: `${cardWidth}px`,
          height: `${dimensions.height}px`,
          position: "relative",
        }}
        className="flex justify-center items-start"
      >
        <div
          style={{
            transform: `scale(${dimensions.scale})`,
            transformOrigin: "top center",
            width: `${cardWidth}px`,
            position: "absolute",
            top: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
