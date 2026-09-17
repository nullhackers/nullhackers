import { useRef, useCallback, useEffect, useState } from 'react';
import './YouTubeSection.css';

// ── Real YouTube channel data (scraped 2026-09-17) ──
const CHANNEL = {
  name: 'nullhackers',
  handle: '@nullhackers',
  subscribers: '1.36K',
  totalViews: '314K+',
  avatar: 'https://yt3.googleusercontent.com/BqjgDoytW9QIlWfLtMPvLf53_F82MzZ9ajPyzLGZl60QwkhEyRKF9h7_9mOxhMLAuJkgctkiciI=s176-c-k-c0x00ffffff-no-rj',
  url: 'https://youtube.com/@nullhackers',
  description:
    'Discover useful websites, AI tools, and the latest technology tips with nullhackers. We explore powerful tools, free AI resources, and practical tech discoveries to help you get more out of the internet.',
};

const VIDEOS = [
  {
    id: 'coJT8RyxIYY',
    title: 'Get Access To DeepSeek V4.1 Flash For Free (No CC Required)',
    views: '188 views',
    date: '4 hours ago',
  },
  {
    id: '1IvhBEQFTtI',
    title: 'FREE AI Video Generator: Text to Video + Image to Video | 100% Free, No Sign Up | No Card',
    views: '7.4K views',
    date: '1 day ago',
  },
  {
    id: 'xk7jnpEag1M',
    title: 'How to Use OPENAI GPT-6 Astra for FREE | 3 Methods That Works [100% Working ]',
    views: '19K views',
    date: '4 days ago',
  },
  {
    id: 'bjEYVh4pV6w',
    title: 'Unlimited AI Video Generation, Zero Cost, No Card Required',
    views: '2.4K views',
    date: '5 days ago',
  },
  {
    id: 'O0xMGsJ2i_U',
    title: 'Unlimited AI Videos, Images & Voice for FREE -- No Clickbait, No Credit Card',
    views: '8.7K views',
    date: '6 days ago',
  },
  {
    id: 'iUTXjrs40pg',
    title: 'All AI Models in One Place: Opus 5, GPT-5.6 Luna, Grok 4.6, Gemini 3.6 and other',
    views: '27K views',
    date: '8 days ago',
  },
];

/* ── YouTube SVG icons ── */
const YouTubeIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#fff" />
  </svg>
);

const PlayIcon = () => (
  <svg width="48" height="48" viewBox="0 0 68 48" fill="none">
    <path d="M66.52 7.74c-.78-2.93-3.07-5.24-5.97-6.03C55.24.13 34 0 34 0S12.76.13 7.45 1.71c-2.9.79-5.2 3.1-5.97 6.03C0 13.05 0 24 0 24s0 10.95 1.48 16.26c.78 2.93 3.07 5.24 5.97 6.03C12.76 47.87 34 48 34 48s21.24-.13 26.55-1.71c2.9-.79 5.2-3.1 5.97-6.03C68 34.95 68 24 68 24s0-10.95-1.48-16.26z" fill="red"/>
    <path d="M27 34l18-10-18-10v20z" fill="white"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ═══════════════════════════════════════════════
   CREATOR SECTION
   ═══════════════════════════════════════════════ */
function CreatorSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    section.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    section.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="yt-creator"
      id="youtube-creator"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      <div className="yt-creator__glow-layer" />

      <div className={`yt-creator__content ${isVisible ? 'yt-creator__content--visible' : ''}`}>
        {/* Terminal heading */}
        <div className="yt-creator__heading-wrap">
          <span className="yt-creator__prompt mono">&gt;</span>
          <h2 className="yt-creator__heading mono">MEET_THE_CREATOR</h2>
          <span className="yt-creator__cursor mono">_</span>
        </div>

        {/* Creator card */}
        <div className="yt-creator__card glass">
          <div className="yt-creator__card-glow" />

          <div className="yt-creator__profile">
            {/* Avatar */}
            <div className="yt-creator__avatar-wrap">
              <img
                src={CHANNEL.avatar}
                alt={CHANNEL.name}
                className="yt-creator__avatar"
                width="100"
                height="100"
                loading="lazy"
              />
              <div className="yt-creator__avatar-ring" />
            </div>

            {/* Info */}
            <div className="yt-creator__info">
              <div className="yt-creator__name-row">
                <h3 className="yt-creator__name">{CHANNEL.name}</h3>
                <span className="yt-creator__handle mono">{CHANNEL.handle}</span>
              </div>

              {/* Stats */}
              <div className="yt-creator__stats">
                <div className="yt-creator__stat">
                  <span className="yt-creator__stat-value">{CHANNEL.subscribers}</span>
                  <span className="yt-creator__stat-label">Subscribers</span>
                </div>
                <div className="yt-creator__stat-divider" />
                <div className="yt-creator__stat">
                  <span className="yt-creator__stat-value">{CHANNEL.totalViews}</span>
                  <span className="yt-creator__stat-label">Total Views</span>
                </div>
                <div className="yt-creator__stat-divider" />
                <div className="yt-creator__stat">
                  <span className="yt-creator__stat-badge">100% FREE</span>
                  <span className="yt-creator__stat-label">Tools Covered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="yt-creator__description">{CHANNEL.description}</p>

          {/* CTA row */}
          <div className="yt-creator__cta-row">
            <a
              href={`${CHANNEL.url}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-creator__subscribe-btn"
            >
              <YouTubeIcon size={20} />
              <span>Subscribe</span>
            </a>
            <span className="yt-creator__cta-hint mono">
              &gt; NEXT_SUBSCRIBER?
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   VIDEO SHOWCASE SECTION
   ═══════════════════════════════════════════════ */
function VideoShowcase() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="yt-videos" id="youtube-videos" ref={sectionRef}>
      <div className={`yt-videos__content ${isVisible ? 'yt-videos__content--visible' : ''}`}>
        {/* Heading */}
        <div className="yt-videos__header">
          <div className="yt-videos__heading-wrap">
            <span className="yt-videos__prompt mono">&gt;</span>
            <h2 className="yt-videos__heading mono">LATEST_FROM_NULLHACKERS</h2>
          </div>
          <p className="yt-videos__subtitle">
            Explore my latest AI tools, useful websites, and tech discoveries.
          </p>
        </div>

        {/* Video grid */}
        <div className="yt-videos__grid">
          {VIDEOS.map((video, i) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="yt-video-card glass"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Thumbnail */}
              <div className="yt-video-card__thumb">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="yt-video-card__img"
                  loading="lazy"
                />
                <div className="yt-video-card__play">
                  <PlayIcon />
                </div>
              </div>

              {/* Meta */}
              <div className="yt-video-card__body">
                <h3 className="yt-video-card__title">{video.title}</h3>
                <div className="yt-video-card__meta">
                  <span className="yt-video-card__views">
                    <EyeIcon />
                    {video.views}
                  </span>
                  {video.date && (
                    <span className="yt-video-card__date">
                      <ClockIcon />
                      {video.date}
                    </span>
                  )}
                </div>
              </div>

              {/* YouTube accent line */}
              <div className="yt-video-card__accent" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   COMBINED EXPORT
   ═══════════════════════════════════════════════ */
export default function YouTubeSection() {
  return (
    <>
      <CreatorSection />
      <VideoShowcase />
    </>
  );
}
