"use client";
import React, { useState, useEffect } from "react";
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
}: ProjectCardProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);

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
