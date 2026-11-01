import { useState, useEffect, useRef, useCallback } from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import './Navbar.css';

/* ── Inline SVG Icons for Nav Items ── */
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
);

const VideoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

const CommunityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/* Navigation items configuration */
const TELEGRAM_URL = 'https://t.me/nullhackerss';

const navLinks = [
  { label: 'Home', target: 'hero-section', icon: HomeIcon, type: 'scroll' },
  { label: 'Video', target: 'youtube-videos', icon: VideoIcon, type: 'scroll' },
  { label: 'AI', target: 'nullai-section', icon: SparklesIcon, type: 'scroll' },
  { label: 'Contact Us', target: 'final-section', icon: MailIcon, type: 'scroll' },
  { label: 'Community', target: TELEGRAM_URL, icon: CommunityIcon, type: 'external' },
];

/* Only scroll-based links participate in active-section tracking */
const scrollLinks = navLinks.filter((l) => l.type === 'scroll');

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-section');
  const navRef = useRef(null);
  const menuRef = useRef(null);

  /* ── Scroll detection with threshold ── */
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Active section tracking via IntersectionObserver ── */
  useEffect(() => {
    const observers = [];

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    scrollLinks.forEach((link) => {
      const el = document.getElementById(link.target);
      if (el) {
        const observer = new IntersectionObserver(handleIntersect, {
          rootMargin: '-30% 0px -60% 0px',
          threshold: 0,
        });
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ── Fallback: set Home active when scrolled near top ── */
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY < 100) {
            setActiveSection('hero-section');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  /* ── Close menu on outside click ── */
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        navRef.current &&
        !navRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  /* ── Close menu on Escape key ── */
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  const handleNavClick = useCallback((link) => {
    if (link.type === 'external') {
      setMenuOpen(false);
      window.open(link.target, '_blank', 'noopener,noreferrer');
      return;
    }

    setMenuOpen(false);

    if (link.target === 'hero-section') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(link.target);
    if (el) {
      const navHeight = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'navbar--scrolled' : 'navbar--top'}`}
        id="navbar"
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar__inner">
          {/* LEFT: Logo */}
          <a href="#" className="navbar__brand" onClick={handleLogoClick}>
            <img
              src="/logo.svg"
              alt="Nullhackers logo"
              className="navbar__logo"
              width="28"
              height="28"
            />
            <span className="navbar__wordmark mono">nullhackers</span>
          </a>

          {/* CENTER: Navigation Links */}
          <ul className="navbar__links" role="menubar">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.type === 'scroll' && activeSection === link.target;
              return (
                <li key={link.label} role="none">
                  <button
                    className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                    onClick={() => handleNavClick(link)}
                    role="menuitem"
                  >
                    <Icon />
                    <span>{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* RIGHT: Existing Elements (GitHub removed) */}
          <div className="navbar__actions">
            <ThemeToggle />

            {/* Hamburger toggle */}
            <button
              className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="navbar-mobile-menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`navbar__mobile-overlay ${menuOpen ? 'open' : ''}`}
        id="navbar-mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="navbar__mobile-menu-inner">
          <ul className="navbar__mobile-links" role="menu">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.type === 'scroll' && activeSection === link.target;
              return (
                <li key={link.label} role="none">
                  <button
                    className={`navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`}
                    onClick={() => handleNavClick(link)}
                    role="menuitem"
                  >
                    <Icon />
                    <span>{link.label}</span>
                    {link.type === 'external' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="navbar__external-icon">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
