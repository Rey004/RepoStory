"use client";

import { useRef, useCallback, useEffect } from "react";

export function useCursorEffects() {
  const rootRef = useRef(null);
  const glowRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorBoxRef = useRef(null);
  const mouseRafRef = useRef(null);
  const isHoveringRef = useRef(false);
  const pendingMouseRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mouseRafRef.current) {
        cancelAnimationFrame(mouseRafRef.current);
      }
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    pendingMouseRef.current = e;

    if (mouseRafRef.current) return;

    mouseRafRef.current = requestAnimationFrame(() => {
      mouseRafRef.current = null;
      const event = pendingMouseRef.current;
      if (!event || !rootRef.current) return;

      const x = event.clientX;
      const y = event.clientY;
      const position = `translate3d(${x}px, ${y}px, 0)`;

      if (glowRef.current) {
        glowRef.current.style.transform = `${position} translate(-50%, -50%)`;
        glowRef.current.dataset.active = "true";
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = position;
      }
      if (cursorBoxRef.current) {
        cursorBoxRef.current.style.transform = `${position} translate(-50%, -50%)`;
      }

      const target = event.target;
      const isInteractive = !!(
        target?.closest("a") ||
        target?.closest("button") ||
        target?.closest("[role='button']") ||
        target?.closest(".cursor-pointer") ||
        target?.closest("input") ||
        target?.closest("select")
      );

      if (isInteractive !== isHoveringRef.current) {
        isHoveringRef.current = isInteractive;
        rootRef.current.dataset.cursorHover = isInteractive ? "true" : "false";
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (mouseRafRef.current) {
      cancelAnimationFrame(mouseRafRef.current);
      mouseRafRef.current = null;
    }
    isHoveringRef.current = false;
    if (rootRef.current) {
      rootRef.current.dataset.cursorHover = "false";
    }
    if (glowRef.current) {
      glowRef.current.dataset.active = "false";
    }
  }, []);

  return {
    rootRef,
    glowRef,
    cursorRef,
    cursorBoxRef,
    handleMouseMove,
    handleMouseLeave,
  };
}
