"use client";

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import ProjectCard, { ProjectCardProps } from "./ProjectCard";

const DURATION = 300;
const EASING   = "cubic-bezier(0.4, 0, 0.2, 1)";

export default function VerticalCarousel({
  projects,
  label,
  tagLinks,
}: {
  projects: ProjectCardProps[];
  label?: string;
  tagLinks?: Record<string, string>;
}) {
  const [active, setActive] = useState(0);
  const [busy, setBusy]     = useState(false);
  const [height, setHeight] = useState<number | string>(0);
  const [isMobile, setIsMobile] = useState(false);

  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeRef   = useRef(active);
  activeRef.current = active;

  // Horizontal drag (desktop)
  const dragStartX = useRef<number | null>(null);
  const dragStartT = useRef<number>(0);
  const lastDx     = useRef<number>(0);
  const isDragging = useRef(false);

  // Vertical touch (mobile)
  const touchStartY    = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Reset to first card when the hero becomes visible again
  useEffect(() => {
    if (!isMobile) return;
    let wasHeroActive = document.body.style.overflow === "hidden";
    const observer = new MutationObserver(() => {
      const isHeroActive = document.body.style.overflow === "hidden";
      if (isHeroActive && !wasHeroActive) {
        // Hero just became visible — reset carousel
        slideRefs.current.forEach(el => {
          if (!el) return;
          el.style.transform  = "";
          el.style.transition = "";
          el.style.opacity    = "";
          el.style.visibility = "";
        });
        setActive(0);
        setBusy(false);
        slideRefs.current[0]?.scrollTo({ top: 0 });
      }
      wasHeroActive = isHeroActive;
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, [isMobile]);

  // Desktop: set viewport height to tallest card
  useLayoutEffect(() => {
    if (isMobile) { setHeight(""); return; }
    const heights = slideRefs.current.map((el) => el?.offsetHeight ?? 0);
    const max = Math.max(...heights);
    if (max > 0) setHeight(max);
  }, [isMobile]);

  // ── Core navigate (unified JS animation) ─────────────────────────────────
  // delta: negative = forward (next), positive = backward (prev)
  // startOffset: how far the incoming card is already displaced (from gesture drag)

  const animateNavigate = useCallback(
    (to: number, delta: number, startOffset?: number) => {
      const cur = activeRef.current;
      const activeEl = slideRefs.current[cur];
      const adjEl    = slideRefs.current[to];
      const size = isMobile
        ? (viewportRef.current?.offsetHeight ?? 600)
        : (viewportRef.current?.offsetWidth ?? 400);

      setBusy(true);

      // Active exits
      if (activeEl) {
        activeEl.style.transition = `transform ${DURATION}ms ${EASING}, opacity ${DURATION}ms ${EASING}`;
        activeEl.style.transform  = isMobile
          ? `translateY(${delta < 0 ? -size : size}px)`
          : `translateX(${delta < 0 ? -size : size}px)`;
        activeEl.style.opacity = "0";
      }

      // Incoming arrives
      if (adjEl) {
        const initialOffset = startOffset ?? (delta < 0 ? size : -size);
        // If no startOffset (button press), position card off-screen first
        if (startOffset === undefined) {
          adjEl.style.transition = "none";
          adjEl.style.transform  = isMobile
            ? `translateY(${initialOffset}px)`
            : `translateX(${initialOffset}px)`;
          adjEl.style.opacity    = "0";
          adjEl.style.visibility = "visible";
        }

        // Force layout flush before animating in
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (!adjEl) return;
          adjEl.style.transition = `transform ${DURATION}ms ${EASING}, opacity ${DURATION}ms ${EASING}`;
          adjEl.style.transform  = isMobile ? "translateY(0)" : "translateX(0)";
          adjEl.style.opacity    = "1";
        }));
      }

      setTimeout(() => {
        if (activeEl) { activeEl.style.transform = ""; activeEl.style.transition = ""; activeEl.style.opacity = ""; }
        if (adjEl)    { adjEl.style.transform = ""; adjEl.style.transition = ""; adjEl.style.visibility = ""; adjEl.style.opacity = ""; }
        setActive(to);
        setBusy(false);
        // Scroll new card to top on mobile
        if (isMobile) setTimeout(() => slideRefs.current[to]?.scrollTo({ top: 0 }), 0);
      }, DURATION + 20);
    },
    [isMobile]
  );

  const navigate = useCallback(
    (to: number, delta: number) => {
      if (busy) return;
      if (isMobile) {
        // No wrapping on mobile
        if (to < 0 || to >= projects.length) return;
      } else {
        to = ((to % projects.length) + projects.length) % projects.length;
      }
      animateNavigate(to, delta);
    },
    [active, busy, isMobile, projects.length, animateNavigate]
  );

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigate(active + 1, -1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   navigate(active - 1,  1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, navigate]);

  // ── Horizontal gesture helpers (desktop) ─────────────────────────────────

  const wrapIdx = (i: number) => ((i % projects.length) + projects.length) % projects.length;
  const adjIdx  = (dx: number) => dx < 0 ? wrapIdx(active + 1) : wrapIdx(active - 1);

  const applyDrag = (dx: number) => {
    const w = viewportRef.current?.offsetWidth ?? 400;
    const activeEl = slideRefs.current[active];
    if (activeEl) { activeEl.style.transition = "none"; activeEl.style.transform = `translateX(${dx}px)`; }
    const adjEl = slideRefs.current[adjIdx(dx)];
    if (adjEl) {
      const offset = dx < 0 ? w + dx : -w + dx;
      adjEl.style.transition = "none";
      adjEl.style.transform  = `translateX(${offset}px)`;
      adjEl.style.visibility = "visible";
      adjEl.style.opacity    = String(Math.min(1, Math.abs(dx) / (w * 0.4)));
    }
  };

  const snapBack = (dx: number) => {
    const w = viewportRef.current?.offsetWidth ?? 400;
    const activeEl = slideRefs.current[active];
    if (activeEl) {
      activeEl.style.transition = `transform ${DURATION}ms cubic-bezier(0.34, 1.2, 0.64, 1)`;
      activeEl.style.transform  = "";
      setTimeout(() => { if (activeEl) activeEl.style.transition = ""; }, DURATION);
    }
    const adjEl = slideRefs.current[adjIdx(dx)];
    if (adjEl) {
      adjEl.style.transition = `transform ${DURATION}ms cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.2s ease`;
      adjEl.style.transform  = `translateX(${dx < 0 ? w : -w}px)`;
      adjEl.style.opacity    = "0";
      setTimeout(() => {
        if (adjEl) { adjEl.style.transition = ""; adjEl.style.transform = ""; adjEl.style.visibility = ""; adjEl.style.opacity = ""; }
      }, DURATION);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (busy) return;
    dragStartX.current = e.clientX;
    dragStartT.current = Date.now();
    lastDx.current     = 0;
    isDragging.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null || busy) return;
    const dx = e.clientX - dragStartX.current;
    if (!isDragging.current && Math.abs(dx) > 8) {
      isDragging.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (!isDragging.current) return;
    lastDx.current = dx;
    applyDrag(dx);
  };

  const onPointerUp = () => {
    if (dragStartX.current === null) return;
    if (isDragging.current) {
      const dx = lastDx.current;
      const dt = Math.max(1, Date.now() - dragStartT.current);
      const velocity = Math.abs(dx) / dt;
      const to = adjIdx(dx);
      if (Math.abs(dx) > 50 || velocity > 0.4) {
        // Continue from drag position
        const w = viewportRef.current?.offsetWidth ?? 400;
        animateNavigate(to, dx, dx < 0 ? w + dx : -w + dx);
      } else {
        snapBack(dx);
      }
    }
    dragStartX.current = null;
    isDragging.current = false;
  };

  // ── Vertical touch events (mobile) ───────────────────────────────────────

  const onTouchStart = (e: React.TouchEvent) => {
    e.nativeEvent.stopPropagation();
    touchStartY.current    = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.nativeEvent.stopPropagation();
    if (touchStartY.current === null || busy) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const dt = Math.max(1, Date.now() - touchStartTime.current);
    const velocity = Math.abs(dy) / dt;
    const slideEl  = slideRefs.current[active];

    if (slideEl && (Math.abs(dy) > 60 || velocity > 0.5)) {
      const atTop    = slideEl.scrollTop <= 4;
      const atBottom = slideEl.scrollTop + slideEl.clientHeight >= slideEl.scrollHeight - 4;
      if (dy < 0 && atBottom) navigate(active + 1, -1);
      else if (dy > 0 && atTop) navigate(active - 1, 1);
    }
    touchStartY.current = null;
  };

  // ── Slide class ───────────────────────────────────────────────────────────

  const slideClass = (i: number) =>
    i === active ? "carousel-slide slide-active" : "carousel-slide slide-hidden";

  // ── Render ────────────────────────────────────────────────────────────────

  const prevDisabled = busy || (isMobile && active === 0);
  const nextDisabled = busy || (isMobile && active === projects.length - 1);

  if (isMobile) {
    return (
      <div className="carousel carousel-mobile">
        <div className="carousel-mobile-header">
          {label && <p className="section-label" style={{ margin: 0 }}>{label}</p>}
        </div>
        <div className="mobile-project-list">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} {...project} index={i} tagLinks={tagLinks} collapsible />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="carousel">
      <div className="carousel-header">
        {label && <p className="section-label" style={{ margin: 0 }}>{label}</p>}
        <div className="carousel-nav">
          <button
            className="carousel-arrow"
            onClick={() => navigate(active - 1, 1)}
            disabled={busy}
            aria-label="Previous"
          >←</button>
          <div className="carousel-dots">
            {projects.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === active ? " active" : ""}`}
                onClick={() => navigate(i, i > active ? -1 : 1)}
                aria-label={`Card ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="carousel-arrow"
            onClick={() => navigate(active + 1, -1)}
            disabled={busy}
            aria-label="Next"
          >→</button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="carousel-viewport"
        style={{ height, userSelect: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div style={{ position: "relative", height: "100%" }}>
          {projects.map((project, i) => (
            <div
              key={project.title}
              ref={(el) => { slideRefs.current[i] = el; }}
              className={slideClass(i)}
            >
              <ProjectCard {...project} index={i} tagLinks={tagLinks} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
