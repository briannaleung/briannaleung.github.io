"use client";

import { useState, useRef, useEffect } from "react";

const PEEK_HEIGHT = 1; // px always visible at bottom

export default function WorkLayout({
  sidebar,
  main,
}: {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}) {
  const [open, setOpen]         = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [heroActive, setHeroActive] = useState(true);

  const sheetRef     = useRef<HTMLDivElement>(null);
  const dragStartY   = useRef<number | null>(null);
  const sheetOpenRef = useRef(sheetOpen);
  sheetOpenRef.current = sheetOpen;

  // Hide sheet while hero is covering the screen (body overflow locked)
  useEffect(() => {
    const check = () => setHeroActive(document.body.style.overflow === "hidden");
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, []);

  const onHandleTouchStart = (e: React.TouchEvent) => {
    e.nativeEvent.stopPropagation();
    dragStartY.current = e.touches[0].clientY;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };

  const onHandleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null || !sheetRef.current) return;
    const dy     = e.touches[0].clientY - dragStartY.current;
    const sheetH = sheetRef.current.offsetHeight;

    if (sheetOpenRef.current) {
      if (dy > 0) sheetRef.current.style.transform = `translateY(${dy}px)`;
    } else {
      const upDy = -dy;
      if (upDy > 0) {
        const translate = Math.max(0, sheetH - PEEK_HEIGHT - upDy);
        sheetRef.current.style.transform = `translateY(${translate}px)`;
      }
    }
  };

  const onHandleTouchEnd = (e: React.TouchEvent) => {
    e.nativeEvent.stopPropagation();
    if (dragStartY.current === null || !sheetRef.current) return;
    const dy = e.changedTouches[0].clientY - dragStartY.current;
    sheetRef.current.style.transition = "";
    sheetRef.current.style.transform  = "";
    if (sheetOpenRef.current) { if (dy > 80)  setSheetOpen(false); }
    else                      { if (-dy > 60) setSheetOpen(true);  }
    dragStartY.current = null;
  };

  return (
    <div className={`layout${open ? "" : " layout-sidebar-hidden"}`} id="main-content">
      <aside className="work-sidebar">
        <div
          className="work-sidebar-clip"
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 0.2s ease",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          {sidebar}
        </div>
      </aside>
      <div className="work-main">
        <button
          className="sidebar-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Hide side panel" : "Show side panel"}
          data-tooltip={open ? "Hide side panel" : "Show side panel"}
        >
          {open ? "‹" : "›"}
        </button>
        {main}
      </div>

      {/* Backdrop */}
      <div
        className="sheet-backdrop"
        style={{ opacity: sheetOpen ? 1 : 0, pointerEvents: sheetOpen ? "auto" : "none" }}
        onClick={() => setSheetOpen(false)}
      />

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        className={`bottom-sheet${sheetOpen ? " bottom-sheet-open" : ""}`}
        style={heroActive ? { transform: "translateY(100%)", pointerEvents: "none", opacity: 0 } : undefined}
      >
        <div
          className="sheet-handle-area"
          onClick={() => setSheetOpen((o) => !o)}
          onTouchStart={onHandleTouchStart}
          onTouchMove={onHandleTouchMove}
          onTouchEnd={onHandleTouchEnd}
        >
          <div className="sheet-handle-bar" />
        </div>
        <div className="sheet-body">
          {sidebar}
        </div>
      </div>
    </div>
  );
}
