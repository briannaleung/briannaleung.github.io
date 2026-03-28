"use client";

import { useState } from "react";

export default function WorkLayout({
  sidebar,
  main,
}: {
  sidebar: React.ReactNode;
  main: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

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

      {/* Skills shown inline below work on mobile */}
      <div className="mobile-skills-section">
        {sidebar}
      </div>
    </div>
  );
}
