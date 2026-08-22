import { useState, useEffect, useRef, useCallback } from 'react';
import TerminalTypewriter from './TerminalTypewriter';
import SocialLinks from './SocialLinks';
import ScrollIndicator from './ScrollIndicator';
import './Hero.css';

export default function Hero() {
  const [phase, setPhase] = useState(0); // 0=loading, 1=terminal, 2=content
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Start sequence
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 400);
    return () => clearTimeout(t);
  }, []);

  const handleTerminalComplete = useCallback(() => {
    setTimeout(() => setPhase(2), 600);
  }, []);

  // Star field background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 120;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initStars();
    };

    const initStars = () => {
      stars = [];
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.008 + 0.003,
        });
      }
    };

    const draw = (time) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const star of stars) {
        const alpha = 0.3 + 0.7 * ((Math.sin(time * star.speed + star.phase) + 1) / 2);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 250, 252, ${alpha})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    resize();
    animFrameRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="hero" id="hero-section">
      {/* Background layers */}
      <canvas className="hero__stars" ref={canvasRef} />
      <div className="hero__glow hero__glow--blue" />
      <div className="hero__glow hero__glow--purple" />
      <div className="hero__orbit hero__orbit--1" />
      <div className="hero__orbit hero__orbit--2" />

      {/* Content */}
      <div className={`hero__content ${phase >= 1 ? 'visible' : ''}`}>
        <div className={`hero__terminal-wrap ${phase >= 1 ? 'fade-in' : ''}`}>
          <TerminalTypewriter onComplete={handleTerminalComplete} />
        </div>

        <div className={`hero__info ${phase >= 2 ? 'fade-in' : ''}`}>
          <h1 className="hero__title mono">
            <span className="hero__title-gradient">Nullhackers</span>
          </h1>
          <p className="hero__subtitle">DECODE THE DIGITAL WORLD</p>
          <SocialLinks className="hero__socials" />
        </div>

        <div className={`hero__scroll ${phase >= 2 ? 'fade-in' : ''}`}>
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
