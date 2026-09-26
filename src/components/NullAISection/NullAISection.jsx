import { useRef, useEffect, useState, useCallback } from 'react';
import {
  getNullAITools,
  selectFeaturedTools,
  NULLAI_WEBSITE,
} from '../../services/nullaiService';
import './NullAISection.css';

/* ── SVG Icons ── */

const SparklesIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* Category → icon mapping (inline SVGs for each category) */
const CategoryIcons = {
  'AI Videos': () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  'AI Images': () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  'Coding': () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  'AI Audio': () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  'AI Writing': () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  'AI Productivity': () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  'AI Design': () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="2.5" />
      <path d="M17.1 10.2A5 5 0 0 0 8.9 10.2L3 21h18l-3.9-10.8z" />
    </svg>
  ),
  'Other': () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

function getCategoryIcon(category) {
  const IconComponent = CategoryIcons[category] || CategoryIcons['Other'];
  return <IconComponent />;
}

/* ═══════════════════════════════════════════════
   CUSTOM HOOK: useNullAITools
   Fetches tools from the NullAI API with caching
   ═══════════════════════════════════════════════ */
function useNullAITools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { tools: allTools } = await getNullAITools();
        if (!cancelled) {
          const featured = selectFeaturedTools(allTools, 3);
          setTools(featured);
          setLoading(false);
        }
      } catch (err) {
        console.error('[NullAISection] Failed to load tools:', err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { tools, loading, error };
}

/* ═══════════════════════════════════════════════
   TOOL CARD COMPONENT
   ═══════════════════════════════════════════════ */
function ToolCard({ tool, index }) {
  const features = tool.features || [];
  const creditInfo = tool.access?.credits;

  return (
    <a
      href={tool.website}
      target="_blank"
      rel="noopener noreferrer"
      className="nullai-card glass"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* Top accent line */}
      <div className="nullai-card__accent" />

      {/* Card glow on hover */}
      <div className="nullai-card__glow" />

      {/* Icon / Logo area */}
      <div className="nullai-card__icon-wrap">
        <div className="nullai-card__icon">
          {getCategoryIcon(tool.category)}
        </div>
      </div>

      {/* Category badge */}
      <div className="nullai-card__category mono">
        {tool.category || 'AI Tool'}
      </div>

      {/* Tool name */}
      <h3 className="nullai-card__name">{tool.name}</h3>

      {/* Description */}
      <p className="nullai-card__description">{tool.description}</p>

      {/* Features / meta */}
      <div className="nullai-card__meta">
        {creditInfo && (
          <span className="nullai-card__credit mono">
            {creditInfo}
          </span>
        )}
        {features.length > 0 && (
          <div className="nullai-card__features">
            {features.slice(0, 2).map((f, i) => (
              <span key={i} className="nullai-card__feature-tag mono">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="nullai-card__cta">
        <span>Explore Tool</span>
        <ExternalLinkIcon />
      </div>
    </a>
  );
}

/* ═══════════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════════ */
function ToolCardSkeleton({ index }) {
  return (
    <div
      className="nullai-card nullai-card--skeleton glass"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="nullai-card__accent" />
      <div className="nullai-skeleton nullai-skeleton--icon" />
      <div className="nullai-skeleton nullai-skeleton--badge" />
      <div className="nullai-skeleton nullai-skeleton--title" />
      <div className="nullai-skeleton nullai-skeleton--text" />
      <div className="nullai-skeleton nullai-skeleton--text nullai-skeleton--short" />
      <div className="nullai-skeleton nullai-skeleton--cta" />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NULLAI SECTION (main export)
   ═══════════════════════════════════════════════ */
export default function NullAISection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { tools, loading, error } = useNullAITools();

  const handleMouseMove = useCallback((e) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    section.style.setProperty(
      '--mouse-x',
      `${((e.clientX - rect.left) / rect.width) * 100}%`
    );
    section.style.setProperty(
      '--mouse-y',
      `${((e.clientY - rect.top) / rect.height) * 100}%`
    );
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="nullai-section"
      id="nullai-section"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Background glow */}
      <div className="nullai-section__glow-layer" />
      <div className="nullai-section__glow-orb nullai-section__glow-orb--1" />
      <div className="nullai-section__glow-orb nullai-section__glow-orb--2" />

      <div
        className={`nullai-section__content ${
          isVisible ? 'nullai-section__content--visible' : ''
        }`}
      >
        {/* Heading */}
        <div className="nullai-section__header">
          <div className="nullai-section__heading-wrap">
            <span className="nullai-section__prompt mono">&gt;</span>
            <h2 className="nullai-section__heading mono">EXPLORE_NULLAI</h2>
          </div>
          <p className="nullai-section__subtitle">
            Discover useful AI tools curated by nullhackers.
          </p>
        </div>

        {/* Row header */}
        <div className="nullai-section__row-header">
          <SparklesIcon />
          <h3 className="nullai-section__row-title mono">Featured Tools</h3>
        </div>

        {/* Tool cards grid */}
        <div className="nullai-section__grid">
          {loading
            ? [0, 1, 2].map((i) => <ToolCardSkeleton key={i} index={i} />)
            : error
            ? null
            : tools.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="nullai-section__error">
            <p className="nullai-section__error-text">
              Unable to load AI tools. Visit{' '}
              <a
                href={NULLAI_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
              >
                NullAI
              </a>{' '}
              directly.
            </p>
          </div>
        )}

        {/* VIEW MORE button */}
        <div className="nullai-section__view-more-wrap">
          <a
            href={NULLAI_WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="nullai-section__view-more-btn"
          >
            <span>VIEW MORE</span>
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
