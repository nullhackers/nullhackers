/**
 * ==============================================================================
 * ORBIT CONFIGURATION — Three-Circle Rotating Logo Animation
 * ==============================================================================
 *
 * This dedicated configuration file controls all aspects of the orbital animation
 * in the NullHackers hero section.
 *
 * Customize any orbit by changing:
 *  - icons: list of logos (id, name, label, iconPath, size, color, angle)
 *  - rotationDuration: duration in seconds for one full 360° orbit rotation
 *  - direction: 'clockwise' (cw) or 'counterclockwise' (ccw)
 *  - radius: orbit circle radius in pixels (at 1x desktop scale)
 *  - borderStyle: 'solid' | 'dashed' | 'dotted'
 *  - borderColor / glowColor: CSS color values for the orbital line & ring glow
 *
 * TO REPLACE OR ADD A LOGO:
 * 1. Place your new SVG or image asset in the `/public/orbit-icons/` folder.
 * 2. Update the corresponding `iconPath` below (e.g., '/orbit-icons/my-logo.svg').
 * 3. Update the `name` and `label` if desired.
 * No changes to animation components are required!
 */

export const orbitConfig = {
  // ============================================================================
  // 1. OUTER ORBIT — Technology, Coding & Hacking
  // ============================================================================
  outerOrbit: {
    id: 'outer-orbit',
    name: 'Technology, Coding & Hacking',
    // Orbit radius in pixels (diameter = radius * 2)
    radius: 380,
    // One full rotation duration in seconds
    rotationDuration: 36,
    // Rotation direction: 'clockwise' or 'counterclockwise'
    direction: 'clockwise',
    // Visual styling of the orbital track line
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(79, 140, 255, 0.16)',
    glowColor: 'rgba(79, 140, 255, 0.08)',
    // Icons displayed on the outer ring
    icons: [
      {
        id: 'ai-neural',
        name: 'AI',
        label: 'AI & Neural Networks',
        description: 'Machine learning & neural computing',
        iconPath: '/orbit-icons/ai-neural.svg',
        // Angular position along orbit in degrees (0 to 360)
        angle: 0,
        // Icon badge container size in px
        size: 44,
        // Theme accent color
        color: '#4F8CFF',
        glow: 'rgba(79, 140, 255, 0.35)',
      },
      {
        id: 'coding-dev',
        name: 'Coding',
        label: 'Coding & Development',
        description: 'Developer tools & programming',
        iconPath: '/orbit-icons/coding-dev.svg',
        angle: 120,
        size: 44,
        color: '#3DFFB0',
        glow: 'rgba(61, 255, 176, 0.35)',
      },
      {
        id: 'cyber-security',
        name: 'Hacking',
        label: 'Cybersecurity & OSINT',
        description: 'Security analysis & penetration testing',
        iconPath: '/orbit-icons/cyber-security.svg',
        angle: 240,
        size: 44,
        color: '#A855F7',
        glow: 'rgba(168, 85, 247, 0.35)',
      },
    ],
  },

  // ============================================================================
  // 2. MIDDLE ORBIT — Content Creation
  // ============================================================================
  middleOrbit: {
    id: 'middle-orbit',
    name: 'Content Creation',
    radius: 285,
    rotationDuration: 27,
    direction: 'counterclockwise',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.14)',
    glowColor: 'rgba(139, 92, 246, 0.08)',
    icons: [
      {
        id: 'youtube',
        name: 'YouTube',
        label: 'YouTube Channel',
        description: 'NullHackers official video tutorials',
        iconPath: '/orbit-icons/youtube.svg',
        angle: 40,
        size: 42,
        color: '#FF0000',
        glow: 'rgba(255, 0, 0, 0.35)',
      },
      {
        id: 'ai-image',
        name: 'Image Creation',
        label: 'AI Image Creation',
        description: 'Generative art & creative visual models',
        iconPath: '/orbit-icons/ai-image.svg',
        angle: 160,
        size: 42,
        color: '#38BDF8',
        glow: 'rgba(56, 189, 248, 0.35)',
      },
      {
        id: 'ai-video',
        name: 'Video Creation',
        label: 'AI Video Generation',
        description: 'AI video synthesis & editing tools',
        iconPath: '/orbit-icons/ai-video.svg',
        angle: 280,
        size: 42,
        color: '#F43F5E',
        glow: 'rgba(244, 63, 94, 0.35)',
      },
    ],
  },

  // ============================================================================
  // 3. INNER ORBIT — AI Tools & Productivity
  // ============================================================================
  innerOrbit: {
    id: 'inner-orbit',
    name: 'AI Tools & Productivity',
    radius: 195,
    rotationDuration: 20,
    direction: 'clockwise',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(61, 255, 176, 0.14)',
    glowColor: 'rgba(61, 255, 176, 0.08)',
    icons: [
      {
        id: 'ai-assistant',
        name: 'AI Assistant',
        label: 'AI Assistant & LLMs',
        description: 'Intelligent conversational agents',
        iconPath: '/orbit-icons/ai-assistant.svg',
        angle: 80,
        size: 38,
        color: '#818CF8',
        glow: 'rgba(129, 140, 248, 0.35)',
      },
      {
        id: 'ai-discovery',
        name: 'AI Tools Discovery',
        label: 'AI Tools Discovery',
        description: 'Curated discovery of web AI tools',
        iconPath: '/orbit-icons/ai-discovery.svg',
        angle: 200,
        size: 38,
        color: '#F59E0B',
        glow: 'rgba(245, 158, 11, 0.35)',
      },
      {
        id: 'ai-automation',
        name: 'Automation',
        label: 'Workflow Automation',
        description: 'Automated scripts & productivity tools',
        iconPath: '/orbit-icons/ai-automation.svg',
        angle: 320,
        size: 38,
        color: '#10B981',
        glow: 'rgba(16, 185, 129, 0.35)',
      },
    ],
  },
};

export default orbitConfig;

