/**
 * NullAI API Service
 *
 * Fetches AI tools from the NullAI backend API,
 * caches results in localStorage with a 6-hour TTL.
 *
 * API Base: https://nullaidb.onrender.com
 * Endpoints:
 *   GET /tools       – returns array of AI tool objects
 *   GET /categories  – returns array of category objects
 */

const NULLAI_API_BASE = 'https://nullaidb.onrender.com';
const NULLAI_WEBSITE = 'https://nullaii.netlify.app';

const CACHE_KEY = 'nullhackers_nullai_cache';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

/* ═══════════════════════════════════════════════
   FALLBACK DATA (used when API is unavailable)
   3 tools chosen from a snapshot of the real API
   ═══════════════════════════════════════════════ */

const FALLBACK_TOOLS = [
  {
    id: 'snapgen-ai',
    name: 'Snapgen.ai',
    website: 'https://snapgen.ai/',
    category: 'AI Videos',
    description:
      'AI video generation tool with unlimited video generation and fast processing.',
    access: {
      loginRequired: true,
      loginMethod: 'Google',
      credits: 'Unlimited video generation',
    },
    generation: {
      type: ['Video'],
      durations: ['8s'],
      resolution: '1080p',
      aspectRatio: null,
    },
    features: ['Faster generation'],
  },
  {
    id: 'zsky-ai',
    name: 'Zsky.ai',
    website: 'https://zsky.ai/',
    category: 'AI Videos',
    description:
      'AI video and image generation platform with editing capabilities.',
    access: {
      loginRequired: true,
      loginMethod: 'Google',
      credits: '400 credits/month',
    },
    generation: {
      type: ['Video', 'Image'],
      durations: ['5s', '8s', '12s'],
      resolution: null,
      aspectRatio: null,
    },
    features: ['Edit video', 'Adjust colours'],
  },
  {
    id: 'hunyuan-video',
    name: 'Hunyuan Video',
    website: 'https://www.hunyuanvideo.org/',
    category: 'AI Videos',
    description:
      'Open AI video generation tool that requires no login or account.',
    access: {
      loginRequired: false,
      loginMethod: null,
      credits: null,
    },
    generation: {
      type: ['Video'],
      durations: ['5s'],
      resolution: null,
      aspectRatio: null,
    },
    features: [],
  },
];

/* ═══════════════════════════════════════════════
   CACHE HELPERS
   ═══════════════════════════════════════════════ */

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(tools) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ tools, timestamp: Date.now() })
    );
  } catch {
    // localStorage may be full or unavailable
  }
}

/* ═══════════════════════════════════════════════
   FETCH TOOLS
   ═══════════════════════════════════════════════ */

/**
 * Fetch AI tools from the NullAI API.
 * Returns an object: { tools: Tool[], fromCache: boolean }
 *
 * On failure, returns fallback data so the section always renders.
 */
export async function getNullAITools() {
  // Check cache first
  const cached = readCache();
  if (cached && cached.tools && cached.tools.length > 0) {
    return { tools: cached.tools, fromCache: true };
  }

  try {
    const response = await fetch(`${NULLAI_API_BASE}/tools`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const tools = await response.json();

    if (Array.isArray(tools) && tools.length > 0) {
      writeCache(tools);
      return { tools, fromCache: false };
    }
    throw new Error('Empty tools response');
  } catch (err) {
    console.warn('[NullAI] API unavailable, using fallback data:', err.message);
    return { tools: FALLBACK_TOOLS, fromCache: false };
  }
}

/**
 * Select 3 featured tools from the full list.
 * Picks a diverse set across categories when possible.
 */
export function selectFeaturedTools(allTools, count = 3) {
  if (!allTools || allTools.length === 0) return FALLBACK_TOOLS.slice(0, count);
  if (allTools.length <= count) return allTools;

  // Try to pick from different categories for diversity
  const byCategory = {};
  for (const tool of allTools) {
    const cat = tool.category || 'Other';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(tool);
  }

  const categories = Object.keys(byCategory);
  const selected = [];

  // Round-robin across categories
  let catIndex = 0;
  while (selected.length < count && selected.length < allTools.length) {
    const cat = categories[catIndex % categories.length];
    const tools = byCategory[cat];
    const nextTool = tools.find((t) => !selected.includes(t));
    if (nextTool) {
      selected.push(nextTool);
    }
    catIndex++;
    // Safety: if we've cycled through all categories without adding, break
    if (catIndex > categories.length * count) break;
  }

  // Fill remaining spots if needed
  if (selected.length < count) {
    for (const tool of allTools) {
      if (!selected.includes(tool)) {
        selected.push(tool);
        if (selected.length >= count) break;
      }
    }
  }

  return selected.slice(0, count);
}

export { NULLAI_WEBSITE, FALLBACK_TOOLS };
