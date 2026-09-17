import { useRef, useCallback, useEffect, useState } from 'react';
import SocialLinks from '../Hero/SocialLinks';
import './AboutUs.css';

export default function AboutUs() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    section.style.setProperty('--mouse-x', `${x}%`);
    section.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="about-us"
      id="about-us"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Subtle glow layer */}
      <div className="about-us__glow-layer" />

      <div className={`about-us__content ${isVisible ? 'about-us__content--visible' : ''}`}>
        {/* Decorative top border line */}
        <div className="about-us__divider">
          <span className="about-us__divider-line" />
          <span className="about-us__divider-dot" />
          <span className="about-us__divider-line" />
        </div>

        {/* Main About Section */}
        <div className="about-us__main">
          <div className="about-us__heading-wrap">
            <span className="about-us__prompt mono">&gt;</span>
            <h2 className="about-us__heading mono">WHO_ARE_WE?</h2>
            <span className="about-us__cursor mono">_</span>
          </div>

          <div className="about-us__body">
            <p className="about-us__text">
              Welcome to <span className="about-us__highlight">nullhackers</span> — your destination for discovering useful websites, AI tools, and the latest technology tips.
            </p>
            <p className="about-us__text">
              We believe technology should be accessible to everyone. Our goal is to help you discover powerful tools, learn new things, and make the most out of the internet — without unnecessary complexity.
            </p>
          </div>
        </div>

        {/* Connect With Us Section */}
        <div className="about-us__connect">
          <div className="about-us__connect-header">
            <span className="about-us__connect-bracket mono">{`{`}</span>
            <h3 className="about-us__connect-title">Connect With Us</h3>
            <span className="about-us__connect-bracket mono">{`}`}</span>
          </div>

          <p className="about-us__connect-text">
            Follow nullhackers on social media to stay updated with the latest AI tools, useful websites, and tech discoveries.
          </p>

          <SocialLinks className="about-us__socials" />
        </div>

        {/* Team Signature */}
        <div className="about-us__signature">
          <span className="about-us__signature-dash">—</span>
          <span className="about-us__signature-text mono">Team nullhackers</span>
        </div>
      </div>
    </section>
  );
}
