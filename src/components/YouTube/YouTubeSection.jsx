import { useRef, useCallback, useEffect, useState } from 'react';
import { getYouTubeData } from '../../services/youtubeService';
import './YouTubeSection.css';

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
   CUSTOM HOOK: useYouTubeData
   Fetches channel stats + latest videos from the
   YouTube Data API v3, with 12-hour localStorage cache.
   ═══════════════════════════════════════════════ */
function useYouTubeData() {
  // Read cached data immediately so the section renders without waiting for the async API call
  const cached = (() => {
    try {
      const raw = localStorage.getItem('nullhackers_yt_cache');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const [channel, setChannel] = useState(cached?.channel || null);
  const [videos, setVideos] = useState(cached?.videos || []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getYouTubeData();
        if (!cancelled) {
          setChannel(data.channel);
          setVideos(data.videos);
        }
      } catch (err) {
        console.error('[YouTubeSection] Failed to load data:', err);
        // Keep the default fallback data already in state
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { channel, videos };
}

/* ═══════════════════════════════════════════════
   CREATOR SECTION
   ═══════════════════════════════════════════════ */
function CreatorSection({ channel }) {
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

  if (!channel) return null;

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
                src={channel.avatar}
                alt={channel.name}
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
                <h3 className="yt-creator__name">{channel.name}</h3>
                <span className="yt-creator__handle mono">{channel.handle}</span>
              </div>

              {/* Stats */}
              <div className="yt-creator__stats">
                <div className="yt-creator__stat">
                  <span className="yt-creator__stat-value">{channel.subscribers}</span>
                  <span className="yt-creator__stat-label">Subscribers</span>
                </div>
                <div className="yt-creator__stat-divider" />
                <div className="yt-creator__stat">
                  <span className="yt-creator__stat-value">{channel.totalViews}</span>
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
          <p className="yt-creator__description">
            Discover useful websites, AI tools, and the latest technology tips with nullhackers. We explore powerful tools, free AI resources, and practical tech discoveries to help you get more out of the internet.
          </p>

          {/* CTA row */}
          <div className="yt-creator__cta-row">
            <a
              href={`${channel.url}?sub_confirmation=1`}
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
function VideoShowcase({ videos }) {
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

  if (!videos || videos.length === 0) return null;

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
          {videos.map((video, i) => (
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
  const { channel, videos } = useYouTubeData();

  return (
    <>
      <CreatorSection channel={channel} />
      <VideoShowcase videos={videos} />
    </>
  );
}
