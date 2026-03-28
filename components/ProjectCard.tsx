"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

// ── Types ────────────────────────────────────────────────────────────────────

export type NodeColor = "green" | "blue" | "amber" | "coral" | "teal" | "purple" | "neutral";

export type ArchFlowItem =
  | { type: "node"; text: string; color: NodeColor }
  | { type: "arrow"; text: string };

export interface ArchDiagramData {
  label: string;
  items: ArchFlowItem[];
}

export interface ProjectDetail {
  label: string;
  value: React.ReactNode;
}

export interface CalloutData {
  text: string;
  variant?: "blue";
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectCardProps {
  title: string;
  company: string;
  companyUrl?: string;
  date?: string;
  projectLinks?: ProjectLink[];
  description: React.ReactNode;
  callout?: CalloutData;
  images?: string[];
  details: ProjectDetail[];
  tags: string[];
  tagLinks?: Record<string, string>;
  arch?: ArchDiagramData;
  index?: number;
  collapsible?: boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Callout({ text, variant }: CalloutData) {
  return (
    <div className={`callout${variant === "blue" ? " blue" : ""}`}>{text}</div>
  );
}

function ArchDiagram({ label, items }: ArchDiagramData) {
  return (
    <div className="arch-diagram">
      <p className="arch-label">{label}</p>
      <div className="arch-flow">
        {items.map((item, i) =>
          item.type === "arrow" ? (
            <span key={i} className="arch-arrow">
              {item.text}
            </span>
          ) : (
            <span key={i} className={`arch-node node-${item.color}`}>
              {item.text}
            </span>
          )
        )}
      </div>
    </div>
  );
}

function LinkStrip({ links }: { links: ProjectLink[] }) {
  return (
    <div className="link-strip">
      {links.map((link) => (
        <a
          key={link.url}
          className="link-strip-item"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label} →
        </a>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProjectCard({
  title,
  company,
  companyUrl,
  date,
  projectLinks,
  description,
  callout,
  images,
  details,
  tags,
  tagLinks,
  arch,
  index,
  collapsible,
}: ProjectCardProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    // Block interaction with everything behind the lightbox
    document.getElementById("main-content")?.setAttribute("inert", "");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.getElementById("main-content")?.removeAttribute("inert");
    };
  }, [lightbox]);

  useEffect(() => {
    if (!isExpanded || !overlayRef.current) return;
    const overlay = overlayRef.current;
    const preventScroll = (e: TouchEvent) => {
      if (scrollRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
    };
    const stopProp = (e: TouchEvent) => e.stopPropagation();
    overlay.addEventListener("touchmove",  preventScroll, { passive: false });
    overlay.addEventListener("touchstart", stopProp,      { passive: true });
    overlay.addEventListener("touchend",   stopProp,      { passive: true });
    return () => {
      overlay.removeEventListener("touchmove",  preventScroll);
      overlay.removeEventListener("touchstart", stopProp);
      overlay.removeEventListener("touchend",   stopProp);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!collapsible) return;
    if (isExpanded) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [collapsible, isExpanded]);

  if (collapsible) {
    const close = () => {
      setIsClosing(true);
    };
    const onAnimationEnd = (e: React.AnimationEvent) => {
      if (isClosing && e.animationName === "sheetSlideDown") {
        setIsExpanded(false);
        setIsClosing(false);
      }
    };

    return (
      <>
        <div className="project-card project-card-collapsible">
          <button className="project-card-toggle" onClick={() => setIsExpanded(true)}>
            <div className="project-collapsed-info">
              <span className="project-collapsed-title">{title}</span>
              <span className="project-collapsed-meta">
                {companyUrl ? (
                  <a className="project-collapsed-company-link" href={companyUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{company}</a>
                ) : (
                  <span>{company}</span>
                )}
              </span>
              {date && <span className="project-collapsed-date">{date}</span>}
            </div>
            <span className="project-toggle-icon" aria-hidden="true">+</span>
          </button>
        </div>

        {isExpanded && createPortal(
          <div ref={overlayRef} className={`card-overlay${isClosing ? " card-overlay-closing" : ""}`} onClick={close}>
            <div
              className={`card-overlay-sheet${isClosing ? " card-overlay-sheet-closing" : ""}`}
              onClick={(e) => e.stopPropagation()}
              onAnimationEnd={onAnimationEnd}
            >
              <div className="card-overlay-header">
                <div className="card-overlay-header-info">
                  <span className="project-collapsed-title">{title}</span>
                  <span className="project-collapsed-meta">
                    {companyUrl ? (
                      <a className="project-company project-company-link" href={companyUrl} target="_blank" rel="noopener noreferrer">{company}</a>
                    ) : (
                      <span className="project-company">{company}</span>
                    )}
                    {date && <span className="project-collapsed-date"> · {date}</span>}
                  </span>
                </div>
                <button className="card-overlay-close" onClick={close} aria-label="Close">✕</button>
              </div>
              <div ref={scrollRef} className="card-overlay-scroll">
                <div className="project-card">
                  <div className="project-main">
                    {images && images.length > 0 && (
                      <div className="project-images">
                        {images.map((src) => (
                          <button key={src} className="project-image-wrap" onClick={() => setLightbox(src)} aria-label="Expand image">
                            <Image src={src} alt="" fill className="project-image" />
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="project-desc">{description}</div>
                    <div className="project-details">
                      {details.map((d) => (
                        <div key={d.label} className="detail-item">
                          <p className="detail-label">{d.label}</p>
                          <p className="detail-value">{d.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="tags-section">
                      <p className="detail-label">Skills &amp; tools</p>
                      <div className="tags">
                        {tags.map((tag) => {
                          const url = tagLinks?.[tag];
                          return url ? (
                            <a key={tag} href={url} target="_blank" rel="noopener noreferrer" className="tag tag-link">{tag}</a>
                          ) : (
                            <span key={tag} className="tag">{tag}</span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {arch && <ArchDiagram {...arch} />}
                  {projectLinks && projectLinks.length > 0 && <LinkStrip links={projectLinks} />}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {lightbox && createPortal(
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <img src={lightbox} alt="" className="lightbox-img" />
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <>
    {lightbox && createPortal(
      <div className="lightbox" onClick={() => setLightbox(null)}>
        <img src={lightbox} alt="" className="lightbox-img" />
      </div>,
      document.body
    )}
    <div className="project-card">
      <div className="project-main">
        <div className="project-header">
          <h2 className="project-title">{title}</h2>
          {index !== undefined && (
            <span className="project-index">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>
        <div className="project-meta">
          {companyUrl ? (
            <a
              className="project-company project-company-link"
              href={companyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {company}
            </a>
          ) : (
            <span className="project-company">{company}</span>
          )}
          {date && <span className="project-date">{date}</span>}
        </div>

        {images && images.length > 0 && (
          <div className="project-images">
            {images.map((src) => (
              <button
                key={src}
                className="project-image-wrap"
                onClick={(e) => { e.stopPropagation(); setLightbox(src); }}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label="Expand image"
              >
                <Image src={src} alt="" fill className="project-image" />
              </button>
            ))}
          </div>
        )}

        <div className="project-desc">{description}</div>

        <div className="project-details">
          {details.map((d) => (
            <div key={d.label} className="detail-item">
              <p className="detail-label">{d.label}</p>
              <p className="detail-value">{d.value}</p>
            </div>
          ))}
        </div>

        <div className="tags-section">
          <p className="detail-label">Skills &amp; tools</p>
          <div className="tags">
            {tags.map((tag) => {
              const url = tagLinks?.[tag];
              return url ? (
                <a key={tag} href={url} target="_blank" rel="noopener noreferrer" className="tag tag-link">
                  {tag}
                </a>
              ) : (
                <span key={tag} className="tag">
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {arch && <ArchDiagram {...arch} />}

      {projectLinks && projectLinks.length > 0 && (
        <LinkStrip links={projectLinks} />
      )}
    </div>
    </>
  );
}
