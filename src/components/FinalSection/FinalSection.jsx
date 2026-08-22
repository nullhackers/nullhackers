import { useRef, useCallback } from 'react';
import SocialLinks from '../Hero/SocialLinks';
import './FinalSection.css';

export default function FinalSection() {
  const sectionRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    section.style.setProperty('--mouse-x', `${x}%`);
    section.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <section
      className="final-section"
      id="final-section"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      <div className="final-section__glow-layer" />
      <div className="final-section__content">
        <div className="final-section__halves">
          {/* Left half */}
          <div className="final-section__left">
            <a href="#" className="final-section__brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <img src="/logo.svg" alt="Nullhackers" width="48" height="48" className="final-section__logo-img" />
            </a>
            <SocialLinks className="final-section__socials" />
          </div>

          {/* Right half */}
          <div className="final-section__right">
            <p className="final-section__contact-label mono">Get in touch</p>
            <a href="mailto:nullhackersss@gmail.com" className="final-section__email mono">
              nullhackersss@gmail.com
            </a>
          </div>
        </div>

        {/* Giant brand wordmark */}
        <div className="final-section__wordmark-wrap">
          <h2 className="final-section__wordmark mono">NULLHACKERS</h2>
        </div>

        {/* Copyright */}
        <p className="final-section__copyright">
          Made with <span className="final-section__heart">♥</span> by Nullhackers · © {currentYear} Nullhackers. All rights reserved.
        </p>
      </div>
    </section>
  );
}
