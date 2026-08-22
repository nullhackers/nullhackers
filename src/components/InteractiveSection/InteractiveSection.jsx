import ParticleBackground from './ParticleBackground';
import './InteractiveSection.css';

export default function InteractiveSection() {
  return (
    <section className="interactive-section section" id="interactive-section">
      <ParticleBackground />
      <div className="interactive-section__glow" />
      <div className="section-inner">
        <div className="content-placeholder">
          {/* Content will be added here later */}
        </div>
      </div>
    </section>
  );
}
