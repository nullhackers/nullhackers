import { useState } from 'react';
import orbitConfig from './orbitConfig';
import './OrbitAnimation.css';

/**
 * Built-in fallback SVG icons
 * Used if an image file fails to load or is missing from /public/orbit-icons/
 */
const FallbackIcons = {
  'ai-neural': () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2a3 3 0 0 0-3 3c0 .35.06.68.17.98l-3.35 2.1a3 3 0 1 0 0 7.84l3.35 2.1a3 3 0 1 0 5.66 0l3.35-2.1a3 3 0 1 0 0-7.84l-3.35-2.1A3 3 0 0 0 12 2z" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  'coding-dev': () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="14" y1="4" x2="10" y2="20" strokeLinecap="round" />
    </svg>
  ),
  'cyber-security': () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2L4 5v6.5c0 5.25 3.42 10.15 8 11.5 4.58-1.35 8-6.25 8-11.5V5l-8-3z" strokeLinejoin="round" />
      <rect x="9" y="11" width="6" height="5" rx="1" fill="currentColor" fillOpacity="0.3" />
      <path d="M10 11V9a2 2 0 0 1 4 0v2" />
    </svg>
  ),
  'youtube': () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff" />
    </svg>
  ),
  'ai-image': () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'ai-video': () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10l5-3.5v11L16 14v-4z" fill="currentColor" fillOpacity="0.2" />
      <polygon points="7.5 9.5 11.5 12 7.5 14.5 7.5 9.5" fill="currentColor" />
    </svg>
  ),
  'ai-assistant': () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="6" width="16" height="13" rx="3" />
      <line x1="12" y1="2" x2="12" y2="6" strokeLinecap="round" />
      <circle cx="9" cy="11.5" r="1.5" fill="currentColor" />
      <circle cx="15" cy="11.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  'ai-discovery': () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <polygon points="12 6.5 14.5 12 12 11 9.5 12 12 6.5" fill="currentColor" />
      <polygon points="12 17.5 9.5 12 12 13 14.5 12 12 17.5" fill="currentColor" fillOpacity="0.3" />
    </svg>
  ),
  'ai-automation': () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

/**
 * Individual Orbit Icon Component
 * Handles image rendering, error fallback, counter-rotation & tooltip
 */
function OrbitIconItem({ icon, orbitDuration, orbitDirection }) {
  const [imgError, setImgError] = useState(false);
  const Fallback = FallbackIcons[icon.id] || FallbackIcons['ai-neural'];

  // Calculate coordinates on the circle:
  // Angle in degrees -> radians
  const rad = ((icon.angle ?? 0) * Math.PI) / 180;
  // Position percentage: center (50%) + offset
  // We use CSS custom properties for position
  const x = Math.cos(rad);
  const y = Math.sin(rad);

  const counterAnimClass =
    orbitDirection === 'counterclockwise'
      ? 'orbit-counter-rotate-ccw'
      : 'orbit-counter-rotate-cw';

  return (
    <div
      className="orbit-icon-slot"
      style={{
        left: `calc(50% + (${x} * var(--ring-radius)))`,
        top: `calc(50% + (${y} * var(--ring-radius)))`,
      }}
    >
      {/* 
        This wrapper applies the counter-rotation so the icon stays perfectly upright!
      */}
      <div
        className={`orbit-icon-upright ${counterAnimClass}`}
        style={{
          animationDuration: `${orbitDuration}s`,
        }}
      >
        <div
          className="orbit-icon-badge"
          style={{
            '--icon-color': icon.color,
            '--icon-glow': icon.glow || `${icon.color}40`,
            width: `${icon.size || 40}px`,
            height: `${icon.size || 40}px`,
          }}
          title={icon.label || icon.name}
          aria-label={icon.label || icon.name}
          role="img"
        >
          {icon.iconPath && !imgError ? (
            <img
              src={icon.iconPath}
              alt={icon.label || icon.name}
              className="orbit-icon-img"
              width={icon.size ? icon.size - 16 : 24}
              height={icon.size ? icon.size - 16 : 24}
              onError={() => setImgError(true)}
              loading="eager"
            />
          ) : (
            <div className="orbit-icon-fallback" style={{ color: icon.color }}>
              <Fallback />
            </div>
          )}

          {/* Hover Tooltip Label */}
          <span className="orbit-icon-tooltip mono">{icon.name || icon.label}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Single Orbit Ring Component
 */
function OrbitRing({ orbitKey, config }) {
  const isCcw = config.direction === 'counterclockwise';
  const animClass = isCcw ? 'orbit-rotate-ccw' : 'orbit-rotate-cw';
  const diameter = config.radius * 2;

  return (
    <div
      className="orbit-ring-container"
      style={{
        '--ring-radius': `${config.radius}px`,
        '--ring-diameter': `${diameter}px`,
        '--ring-duration': `${config.rotationDuration}s`,
        '--ring-border-style': config.borderStyle || 'solid',
        '--ring-border-color': config.borderColor || 'rgba(79, 140, 255, 0.15)',
        '--ring-glow-color': config.glowColor || 'rgba(79, 140, 255, 0.05)',
      }}
    >
      {/* The rotating orbital track */}
      <div
        className={`orbit-ring-track ${animClass}`}
        style={{
          animationDuration: `${config.rotationDuration}s`,
        }}
      >
        {/* Render each icon attached to this orbit */}
        {config.icons.map((icon, index) => {
          // If angle not explicitly provided, space evenly
          const computedAngle =
            icon.angle !== undefined
              ? icon.angle
              : (360 / config.icons.length) * index;

          const iconWithAngle = { ...icon, angle: computedAngle };

          return (
            <OrbitIconItem
              key={icon.id || `${orbitKey}-${index}`}
              icon={iconWithAngle}
              orbitDuration={config.rotationDuration}
              orbitDirection={config.direction}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Main OrbitAnimation Component
 * Houses the three concentric orbits: Outer, Middle, Inner
 */
export default function OrbitAnimation() {
  const { outerOrbit, middleOrbit, innerOrbit } = orbitConfig;

  return (
    <div
      className="hero-orbit-system"
      role="region"
      aria-label="NullHackers Technology Ecosystem Orbit"
    >
      {/* Outer Orbit — Technology, Coding & Hacking */}
      {outerOrbit && <OrbitRing orbitKey="outer" config={outerOrbit} />}

      {/* Middle Orbit — Content Creation */}
      {middleOrbit && <OrbitRing orbitKey="middle" config={middleOrbit} />}

      {/* Inner Orbit — AI Tools & Productivity */}
      {innerOrbit && <OrbitRing orbitKey="inner" config={innerOrbit} />}

      {/* Central subtle ambient glow */}
      <div className="orbit-central-glow" />
    </div>
  );
}

