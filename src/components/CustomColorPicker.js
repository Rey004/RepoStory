"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// Convert hex to HSV
function hexToHsv(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max, v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h, s, v };
}

// Convert HSV to hex
function hsvToHex(h, s, v) {
  const f = (n) => {
    const k = (n + h * 6) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

function isValidHex(str) {
  return /^#[0-9a-fA-F]{6}$/.test(str);
}

export default function CustomColorPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState(() => hexToHsv(isValidHex(value) ? value : "#00ff66"));
  const [hexInput, setHexInput] = useState(value);
  const [dragging, setDragging] = useState(null); // "sv" | "hue"
  const svRef = useRef(null);
  const hueRef = useRef(null);
  const popupRef = useRef(null);

  // Sync external value → internal HSV
  useEffect(() => {
    if (isValidHex(value)) {
      setHsv(hexToHsv(value));
      setHexInput(value);
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const applyHsv = useCallback((newHsv) => {
    setHsv(newHsv);
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    setHexInput(hex);
    onChange(hex);
  }, [onChange]);

  // SV pad interaction
  const handleSvEvent = useCallback((e) => {
    if (!svRef.current) return;
    const rect = svRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const s = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const v = Math.min(1, Math.max(0, 1 - (clientY - rect.top) / rect.height));
    applyHsv({ ...hsv, s, v });
  }, [hsv, applyHsv]);

  // Hue slider interaction
  const handleHueEvent = useCallback((e) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const h = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    applyHsv({ ...hsv, h });
  }, [hsv, applyHsv]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => dragging === "sv" ? handleSvEvent(e) : handleHueEvent(e);
    const up = () => setDragging(null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, handleSvEvent, handleHueEvent]);

  const hueColor = hsvToHex(hsv.h, 1, 1);
  const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);

  const presets = [
    "#00ff66", "#00f0ff", "#a855f7", "#ff007f", "#f97316", "#ef4444",
    "#facc15", "#3b82f6", "#10b981", "#ec4899", "#6366f1", "#ffffff",
  ];

  return (
    <div className="relative" ref={popupRef}>
      {/* Swatch trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-6 h-6 rounded-full border-2 border-zinc-700 hover:border-zinc-500 transition-colors cursor-pointer shadow-inner"
        style={{ backgroundColor: value }}
        title="Pick accent color"
      />

      {/* Popup panel */}
      {open && (
        <div
          className="absolute right-0 bottom-8 md:bottom-auto md:top-8 z-50 w-[210px] sm:w-[220px] md:w-[240px] rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 overflow-hidden"
          style={{ boxShadow: `0 0 0 1px #27272a, 0 20px 60px rgba(0,0,0,0.8), 0 0 20px ${currentHex}18` }}
        >
          {/* SV gradient pad */}
          <div
            ref={svRef}
            className="relative w-full h-28 sm:h-32 md:h-36 cursor-crosshair select-none"
            style={{
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
            }}
            onMouseDown={(e) => { setDragging("sv"); handleSvEvent(e); }}
            onTouchStart={(e) => { setDragging("sv"); handleSvEvent(e); }}
          >
            {/* Picker thumb */}
            <div
              className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
                backgroundColor: currentHex,
                boxShadow: `0 0 0 1px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.5)`,
              }}
            />
          </div>

          <div className="px-2.5 py-2 md:px-3 md:py-2.5 flex flex-col gap-2 md:gap-2.5 bg-[#0a0a0a] border-t border-zinc-900">
            {/* Hue slider */}
            <div
              ref={hueRef}
              className="relative w-full h-3 rounded-full cursor-pointer select-none"
              style={{
                background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
              }}
              onMouseDown={(e) => { setDragging("hue"); handleHueEvent(e); }}
              onTouchStart={(e) => { setDragging("hue"); handleHueEvent(e); }}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white pointer-events-none"
                style={{
                  left: `${hsv.h * 100}%`,
                  backgroundColor: hueColor,
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.5)",
                }}
              />
            </div>

            {/* Preview + Hex input */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg border border-zinc-800 shrink-0 shadow-inner"
                style={{ backgroundColor: currentHex }}
              />
              <div className="flex-1 flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 focus-within:border-zinc-600 transition-colors">
                <span className="text-zinc-600 text-xs font-mono">#</span>
                <input
                  type="text"
                  value={hexInput.replace("#", "")}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                    setHexInput("#" + raw);
                    if (raw.length === 6 && isValidHex("#" + raw)) {
                      applyHsv(hexToHsv("#" + raw));
                    }
                  }}
                  className="w-full bg-transparent text-xs font-mono text-zinc-200 outline-none tracking-widest uppercase"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Preset swatches */}
            <div>
              <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-mono mb-1.5 block">Presets</span>
              <div className="grid grid-cols-6 gap-1.5">
                {presets.map((color) => (
                  <button
                    key={color}
                    onClick={() => { applyHsv(hexToHsv(color)); }}
                    className="w-full aspect-square rounded-md border transition-all duration-150 cursor-pointer hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: currentHex.toLowerCase() === color.toLowerCase() ? "white" : "#3f3f46",
                      boxShadow: currentHex.toLowerCase() === color.toLowerCase() ? `0 0 8px ${color}80` : "none",
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
