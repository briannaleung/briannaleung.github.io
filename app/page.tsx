import Image from "next/image";
import { ProjectCardProps } from "@/components/ProjectCard";
import VerticalCarousel from "@/components/VerticalCarousel";
import CurtainHero from "@/components/CurtainHero";
import StaggerReveal from "@/components/StaggerReveal";
import FadeInBlur from "@/components/FadeInBlur";
import CountUp from "@/components/CountUp";
import WorkLayout from "@/components/WorkLayout";

const projects: ProjectCardProps[] = [
  {
    title: "Checkout Rules — Validation Interface & RPC Architecture",
    company: "Shopify",
    companyUrl: "https://shopify.com",
    date: "May 2022 – Dec 2025",
    projectLinks: [
      {
        label: "Shopify Functions docs",
        url: "https://shopify.dev/docs/apps/build/functions",
      },
      {
        label: "Checkout validation docs",
        url: "https://shopify.dev/docs/apps/build/checkout/cart-checkout-validation/create-admin-ui-validation?extension=polaris",
      },
    ],
    description: (
      <ul className="project-bullets">
        <li>Built the merchant-facing UI for <strong>Checkout Rules</strong>, Shopify&apos;s platform for defining and enforcing custom validation logic at checkout — rules are enforced in real time via a Shopify Function compiled to WebAssembly</li>
        <li>The UI extension runs in an isolated <strong>web worker</strong>, sandboxed from the admin host. Helped establish a new <strong>RPC pattern</strong> to coordinate saving across the host and extension simultaneously — changes had to commit atomically with clear failure handling on either side</li>
        <li>Extended the interface to support <strong>third-party apps</strong> integrating their own custom validation logic via the same RPC layer, broadening the platform beyond Shopify&apos;s own rules</li>
      </ul>
    ),
    details: [
      { label: "My role", value: "Frontend UI + RPC save pattern" },
      { label: "Impact", value: "Shopify Plus merchants globally" },
    ],
    tags: [
      "React",
      "TypeScript",
      "Web Workers",
      "RPC / message passing",
      "Polaris",
      "Admin UI Extensions",
      "Shopify Functions",
      "GraphQL",
      "Metafields",
    ],
  },
  {
    title: "Polaris Web Components Migration — Checkout Consent Fields",
    company: "Shopify",
    companyUrl: "https://shopify.com",
    date: "May 2022 – Dec 2025",
    images: ["/consent-checkbox.png", "/consent-phone-field.png"],
    projectLinks: [
      {
        label: "Shopify API 2025-10: web components & Preact",
        url: "https://gadget.dev/blog/shopify-api-2025-10-web-components-preact",
      },
      {
        label: "Consent checkbox docs",
        url: "https://shopify.dev/docs/api/checkout-ui-extensions/latest/web-components/forms/consent-checkbox",
      },
      {
        label: "Consent phone field docs",
        url: "https://shopify.dev/docs/api/checkout-ui-extensions/latest/web-components/forms/consent-phone-field",
      },
    ],
    description: (
      <ul className="project-bullets">
        <li>Contributed to Shopify&apos;s migration of checkout UI extensions from <strong>Polaris React to Polaris web components</strong> — a platform-wide shift introduced in the 2025-10 API, moving to a single set of framework-agnostic components shared across admin apps and extension surfaces</li>
        <li>Worked specifically on the <strong>consent checkbox</strong> and <strong>consent phone field</strong> — compliance UI that needed exact behavioural parity across the migration while conforming to web standards, legal requirements, and the new 64kb bundle size limit</li>
        <li>Worked within <strong>Preact</strong> instead of React for the extension layer — a smaller runtime footprint with a similar API, but real differences in state, refs, and lifecycle</li>
      </ul>
    ),
    details: [
      { label: "My role", value: "Consent checkbox + consent phone field migration" },
      { label: "Impact", value: "Backwards-compatible compliance UI across all Shopify checkouts" },
    ],
    tags: [
      "Preact",
      "Polaris web components",
      "TypeScript",
      "Checkout UI Extensions",
      "Accessibility",
    ],
  },
  {
    title: "Checkout Extensions API — Stability & Markets Access Control",
    company: "Shopify",
    companyUrl: "https://shopify.com",
    date: "May 2022 – Dec 2025",
    projectLinks: [
      {
        label: "Shopify Markets checkout docs",
        url: "https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/markets/checkout-accounts-inheritance",
      },
      {
        label: "Customize checkout for markets",
        url: "https://help.shopify.com/en/manual/checkout-settings/customize-checkout-configurations/markets",
      },
      {
        label: "Manage markets",
        url: "https://help.shopify.com/en/manual/markets-new/manage#create-market",
      },
    ],
    description: (
      <ul className="project-bullets">
        <li>Owned investigation and resolution of <strong>complex race conditions and API flaws</strong> in the Checkout Extensions API — a platform-level surface used by Plus merchants and third-party developers affecting revenue-critical flows at high volume</li>
        <li>Contributed to <strong>Shopify Markets</strong> customizations within checkout, implementing plan-based feature gating: defining Rails permissions and extending the API to enforce market-specific access control across the frontend and backend boundary</li>
        <li>Improved <strong>storefront code editor performance</strong>, enabling merchants to customize storefront functionality more reliably within the admin</li>
      </ul>
    ),
    details: [
      { label: "My role", value: "Platform frontend — API, stability, access control" },
      { label: "Impact", value: "Checkout Extensions API stability for Plus merchants globally" },
    ],
    tags: [
      "React",
      "TypeScript",
      "GraphQL",
      "Ruby on Rails",
    ],
  },
  {
    title: "Admin Dashboard — Accessibility & Social Content Ingestion at Scale",
    company: "PixleeTurnTo (now Emplifi)",
    companyUrl: "https://www.pixlee.com",
    date: "Jan 2020 – Dec 2020",
    images: ["/pixlee-dashboard.png"],
    description: (
      <ul className="project-bullets">
        <li>Worked across two internship terms on both the frontend and backend of PixleeTurnTo&apos;s admin dashboard — a data-heavy interface for managing user-generated content across social platforms</li>
        <li>Led an <strong>accessibility overhaul</strong> of the admin panel to WCAG 2.0 standards: full keyboard navigation, voice reader support, and 20% expanded test coverage via Cypress and RSpec</li>
        <li>Built a <strong>new TikTok data ingestion pipeline</strong> from scratch alongside existing Instagram, Facebook, and Twitter streams. Used <strong>Elasticsearch bulk operations</strong> for scale, redesigned legacy RESTful endpoints for 20% throughput improvement, and authored Rails migrations for large production tables</li>
      </ul>
    ),
    details: [
      { label: "My role", value: "Frontend accessibility + backend data pipeline" },
      { label: "Impact", value: <><CountUp to={20} />% throughput improvement, WCAG 2.0 compliance</> },
    ],
    tags: [
      "Python",
      "Ruby on Rails",
      "Elasticsearch",
      "Backbone.js",
      "Cypress",
      "RSpec",
    ],
  },
  {
    title: "Big Data Visualisation & Task Queue Infrastructure",
    company: "Shopper Army",
    companyUrl: "https://www.shopperarmy.com",
    date: "May – Aug 2019",
    images: ["/shopperarmy.png"],
    projectLinks: [
      {
        label: "Shopper Army review",
        url: "https://www.savvynewcanadians.com/shopper-army-review/",
      },
    ],
    description: (
      <ul className="project-bullets">
        <li>Rebuilt existing pages using <strong>Vuetify components</strong>, achieving a <strong>500x improvement in loading speed</strong> on a platform serving data-heavy views</li>
        <li>Implemented a new system for querying and <strong>visualising big data with Elasticsearch and Kibana</strong>, replacing a manual process with a queryable dashboard. Built a <strong>task-queuing service using Celery and RabbitMQ</strong> to automate daily vendor API data pulls</li>
        <li>Restructured data syncing integrations with <strong>Sendgrid, Storyblok, and SurveyGizmo</strong>, improving reliability across external touchpoints</li>
      </ul>
    ),
    details: [
      { label: "My role", value: "Full-stack — frontend rebuild + backend infrastructure" },
      { label: "Impact", value: <><CountUp to={500} />x page load improvement</> },
    ],
    tags: [
      "Vue.js",
      "Vuetify",
      "Python",
      "Elasticsearch",
      "Kibana",
      "Celery",
      "RabbitMQ",
      "Django",
    ],
  },
];

interface SkillTag {
  label: string;
  url?: string;
}

interface SkillGroup {
  group: string;
  tags: SkillTag[];
}

const skills: SkillGroup[] = [
  {
    group: "Frontend",
    tags: [
      { label: "React" },
      { label: "Preact" },
      { label: "TypeScript" },
      { label: "JavaScript" },
      { label: "Web Workers" },
      { label: "Vue.js" },
      { label: "Backbone.js" },
      { label: "Marionette" },
      { label: "HTML / CSS" },
    ],
  },
  {
    group: "APIs & data",
    tags: [
      { label: "GraphQL" },
      { label: "REST" },
      { label: "RPC" },
      { label: "Elasticsearch" },
      { label: "Kibana" },
      { label: "RabbitMQ" },
    ],
  },
  {
    group: "Shopify platform",
    tags: [
      { label: "Admin UI Extensions", url: "https://shopify.dev/docs/api/admin-extensions" },
      { label: "Checkout Extensions API", url: "https://shopify.dev/docs/api/checkout-ui-extensions" },
      { label: "Shopify Functions", url: "https://shopify.dev/docs/apps/build/functions" },
      { label: "Polaris", url: "https://polaris.shopify.com" },
      { label: "Metafields", url: "https://shopify.dev/docs/apps/build/custom-data/metafields" },
    ],
  },
  {
    group: "Backend & other",
    tags: [
      { label: "Ruby on Rails" },
      { label: "Python" },
      { label: "Django" },
      { label: "Celery" },
      { label: "Cypress" },
    ],
  },
];

const TAG_URLS: Record<string, string> = {
  "Admin UI Extensions": "https://shopify.dev/docs/api/admin-extensions",
  "Checkout Extensions API": "https://shopify.dev/docs/api/checkout-ui-extensions",
  "Checkout UI Extensions": "https://shopify.dev/docs/api/checkout-ui-extensions",
  "Shopify Functions": "https://shopify.dev/docs/apps/build/functions",
  "Polaris": "https://polaris.shopify.com",
  "Polaris web components": "https://polaris.shopify.com",
  "Metafields": "https://shopify.dev/docs/apps/build/custom-data/metafields",
};

export default function Home() {
  return (
    <>
      {/* Full-viewport hero — curtain over work section */}
      <CurtainHero>
        <div className="hero-inner">
          <header>
              <div className="header-body">
                <div className="profile-pic-container">
                  <Image
                    src="/profile_pic.jpeg"
                    alt="Brianna Leung"
                    fill
                    className="profile-pic"
                  />
                </div>
                <div className="header-text">
                  <h1 className="name">Brianna Leung</h1>
                  <p className="header-contact">
                    <a href="mailto:briannaleung2008@live.ca">Email</a>
                    <span>·</span>
                    <a
                      href="https://linkedin.com/in/brianna-leung"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </p>
                  <p className="bio">
                    Frontend engineer with 4 years at <strong>Shopify</strong>{" "}building
                    complex product UI — from novel extension architectures to
                    platform-level API work and component migrations. I&apos;ve also
                    shipped full-stack features at earlier-stage companies, working across
                    data pipelines, admin dashboards, and performance-critical UIs. I care
                    about making operational tools feel simple, fast, and reliable.
                  </p>
                </div>
              </div>
            </header>

            {/* Skills laid out horizontally below the intro */}
            <div className="hero-skills">
              <p className="section-label">Skills &amp; tools</p>
              <StaggerReveal className="hero-skills-row">
                {skills.map((group) => (
                  <div key={group.group} className="skill-group">
                    <p className="skill-group-title">{group.group}</p>
                    <div className="skill-list">
                      {group.tags.map((tag) =>
                        tag.url ? (
                          <a
                            key={tag.label}
                            href={tag.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="skill-tag skill-tag-link"
                          >
                            {tag.label}
                          </a>
                        ) : (
                          <span key={tag.label} className="skill-tag">
                            {tag.label}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </StaggerReveal>
            </div>
        </div>
      </CurtainHero>

      {/* Two-column layout: sidebar + carousel */}
      <WorkLayout
        sidebar={
          <FadeInBlur>
            <div className="work-sidebar-inner">
              <div className="sidebar-profile-row">
                <div className="sidebar-pic-container">
                  <Image src="/profile_pic.jpeg" alt="Brianna Leung" fill className="profile-pic" />
                </div>
                <p className="work-sidebar-name">Brianna Leung</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p className="section-label" style={{ margin: 0 }}>Skills &amp; tools</p>
              <div className="sidebar-skills">
                {skills.map((group) => (
                  <div key={group.group} className="skill-group">
                    <p className="skill-group-title">{group.group}</p>
                    <div className="skill-list">
                      {group.tags.map((tag) =>
                        tag.url ? (
                          <a key={tag.label} href={tag.url} target="_blank" rel="noopener noreferrer" className="skill-tag skill-tag-link">
                            {tag.label}
                          </a>
                        ) : (
                          <span key={tag.label} className="skill-tag">{tag.label}</span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </FadeInBlur>
        }
        main={
          <FadeInBlur delay={120}>
            <section>
              <VerticalCarousel projects={projects} label="Selected work" tagLinks={TAG_URLS} />
            </section>
          </FadeInBlur>
        }
      />

      {/* Full-width footer */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="footer-name">Brianna Leung · Frontend Engineer · Toronto</p>
          <div className="footer-links">
            <a href="mailto:briannaleung2008@live.ca">Email</a>
            <a href="https://linkedin.com/in/brianna-leung" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  );
}
