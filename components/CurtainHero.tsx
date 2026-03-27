"use client";

import { useState, useEffect } from "react";

type HeroState = "visible" | "hiding" | "hidden" | "showing";

export default function CurtainHero({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HeroState>("visible");

  const hide = () => { if (state === "visible") setState("hiding"); };
  const show = () => { if (state === "hidden") setState("showing"); };

  // Lock body scroll while hero is visible
  useEffect(() => {
    const locked = state === "visible" || state === "showing";
    document.body.style.overflow = locked ? "hidden" : "";
    if (state === "visible") window.scrollTo(0, 0);
    return () => { document.body.style.overflow = ""; };
  }, [state]);

  // Scroll down / swipe up → hide
  useEffect(() => {
    if (state !== "visible") return;
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 20) hide(); };
    let ty = 0;
    const onTouchStart = (e: TouchEvent) => { ty = e.touches[0].clientY; };
    const onTouchEnd   = (e: TouchEvent) => { if (ty - e.changedTouches[0].clientY > 40) hide(); };
    window.addEventListener("wheel",      onWheel,      { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [state]);

  // At top of page, scroll up / swipe down → show
  useEffect(() => {
    if (state !== "hidden") return;
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY === 0 && e.deltaY < -20) show();
    };
    let ty = 0;
    let startedAtTop = false;
    const onTouchStart = (e: TouchEvent) => {
      ty = e.touches[0].clientY;
      startedAtTop = window.scrollY === 0;
    };
    const onTouchEnd   = (e: TouchEvent) => {
      if (startedAtTop && window.scrollY === 0 && e.changedTouches[0].clientY - ty > 120) show();
    };
    window.addEventListener("wheel",      onWheel,      { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [state]);

  const onAnimationEnd = () => {
    if (state === "hiding")  setState("hidden");
    if (state === "showing") setState("visible");
  };

  const animClass =
    state === "hiding"  ? "hero-card-up" :
    state === "showing" ? "hero-card-down" : "";

  return (
    <div
      className={`hero-outer ${animClass}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        pointerEvents: state === "hidden" ? "none" : "auto",
        visibility: state === "hidden" ? "hidden" : "visible",
      }}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
      <button
        className="hero-scroll-hint"
        onClick={hide}
        aria-label="Reveal work"
      >
        <span className="hero-scroll-label">Scroll down</span>
        <span>↓</span>
      </button>
    </div>
  );
}
