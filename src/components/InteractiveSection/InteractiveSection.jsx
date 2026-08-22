import { useTheme } from '../../context/ThemeContext';
import ParticleBackground from './ParticleBackground';
import logoBright from '../../assets/null-logo-bright.png';
import logoDark from '../../assets/null-logo-dark.png';
import './InteractiveSection.css';

export default function InteractiveSection() {
  const { theme } = useTheme();
  const logo = theme === 'dark' ? logoDark : logoBright;

  return (
    <section className="interactive-section section" id="about-section">
      <ParticleBackground />
      <div className="interactive-section__glow" />
      <div className="section-inner">
        <div className="about-content">
          {/* Logo */}
          <div className="about-logo-wrap">
            <img
              src={logo}
              alt="Nullhackers Logo"
              className="about-logo"
            />
          </div>

          {/* Heading */}
          <h2 className="about-heading mono">
            <span className="about-heading__prompt">&gt;&nbsp;</span>
            <span className="about-heading__text">WHO_ARE_WE?</span>
          </h2>

          {/* Tagline */}
          <p className="about-tagline">DECODE THE DIGITAL WORLD</p>

          {/* Category tags */}
          <div className="about-tags">
            <span className="about-tag">Technology</span>
            <span className="about-tag-sep">•</span>
            <span className="about-tag">AI</span>
            <span className="about-tag-sep">•</span>
            <span className="about-tag">Cybersecurity</span>
            <span className="about-tag-sep">•</span>
            <span className="about-tag">Tools</span>
          </div>
        </div>
      </div>
    </section>
  );
}
