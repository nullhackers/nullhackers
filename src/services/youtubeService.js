/**
 * YouTube Data API v3 Service
 *
 * Fetches channel statistics and latest videos from YouTube,
 * caches results in localStorage with a 12-hour TTL.
 *
 * Environment variables (Vite):
 *   VITE_YOUTUBE_API_KEY     – YouTube Data API v3 key
 *   VITE_YOUTUBE_CHANNEL_ID  – YouTube channel ID (UCXqGb7Y0XIIw8kixhHhEt_w)
 */

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'UCXqGb7Y0XIIw8kixhHhEt_w';

const CACHE_KEY = 'nullhackers_yt_cache';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

/* ═══════════════════════════════════════════════
   FALLBACK DATA  (used when API is unavailable)
   ═══════════════════════════════════════════════ */

const FALLBACK_CHANNEL = {
  name: 'nullhackers',
  handle: '@nullhackers',
  subscribers: '1.36K',
  totalViews: '314K+',
  avatar:
    'https://yt3.googleusercontent.com/BqjgDoytW9QIlWfLtMPvLf53_F82MzZ9ajPyzLGZl60QwkhEyRKF9h7_9mOxhMLAuJkgctkiciI=s176-c-k-c0x00ffffff-no-rj',
  url: 'https://youtube.com/@nullhackers',
  description:
    'Discover useful websites, AI tools, and the latest technology tips with nullhackers. We explore powerful tools, free AI resources, and practical tech discoveries to help you get more out of the internet.',
};



/* ═══════════════════════════════════════════════
   NUMBER & DATE FORMATTERS
   ═══════════════════════════════════════════════ */

/**
 * Format a raw number into a compact human-readable string.
 * e.g. 1360 → "1.36K", 314000 → "314K", 2400000 → "2.4M"
 */
export function formatCount(num) {
  const n = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(n)) return '0';

  if (n >= 1_000_000_000) {
    const v = n / 1_000_000_000;
    return v % 1 === 0 ? `${v}B` : `${parseFloat(v.toFixed(2))}B`;
  }
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return v % 1 === 0 ? `${v}M` : `${parseFloat(v.toFixed(1))}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    // For counts ≥ 10K, show without decimals: "19K"
    if (n >= 10_000) return `${parseFloat(v.toFixed(0))}K`;
    // For counts < 10K, show one or two decimals: "1.36K", "7.4K"
    return `${parseFloat(v.toFixed(2))}K`;
  }
  return n.toString();
}

/**
 * Format view count for display: "188 views", "7.4K views"
 */
export function formatViews(viewCount) {
  const n = typeof viewCount === 'string' ? parseInt(viewCount, 10) : viewCount;
  if (isNaN(n)) return '0 views';
  return `${formatCount(n)} views`;
}

/**
 * Convert an ISO 8601 date string to a relative time string.
 * e.g. "2026-09-17T10:00:00Z" → "1 day ago"
 */
export function timeAgo(dateString) {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'just now';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return years === 1 ? '1 year ago' : `${years} years ago`;
  if (months > 0) return months === 1 ? '1 month ago' : `${months} months ago`;
  if (weeks > 0) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`;
  if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  if (minutes > 0) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  return 'just now';
}

/* ═══════════════════════════════════════════════
   CACHE HELPERS
   ═══════════════════════════════════════════════ */

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ...data, timestamp: Date.now() })
    );
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

function isCacheFresh(cache) {
  if (!cache || !cache.timestamp) return false;
  return Date.now() - cache.timestamp < CACHE_TTL_MS;
}

/* ═══════════════════════════════════════════════
   DURATION HELPERS
   ═══════════════════════════════════════════════ */

/**
 * Parse an ISO 8601 duration string (from YouTube contentDetails.duration)
 * into total seconds.  e.g. "PT1M30S" → 90, "PT5M" → 300, "PT1H2M3S" → 3723
 */
function parseDurationToSeconds(isoDuration) {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * A YouTube Short is typically ≤ 60 seconds.
 * We use a threshold of 65 seconds to be safe.
 */
function isShort(durationISO) {
  return parseDurationToSeconds(durationISO) <= 65;
}

/* ═══════════════════════════════════════════════
   API FETCH FUNCTIONS
   ═══════════════════════════════════════════════ */

/**
 * Fetch channel statistics (subscriber count, total view count, avatar, etc.)
 */
async function fetchChannelStats() {
  const url = `${YT_API_BASE}/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Channels API error: ${res.status}`);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }

  const item = data.items[0];
  const { snippet, statistics } = item;

  return {
    name: snippet.title || FALLBACK_CHANNEL.name,
    handle: snippet.customUrl ? `@${snippet.customUrl.replace(/^@/, '')}` : FALLBACK_CHANNEL.handle,
    subscribers: formatCount(statistics.subscriberCount),
    totalViews: formatCount(statistics.viewCount) + '+',
    avatar:
      snippet.thumbnails?.medium?.url ||
      snippet.thumbnails?.default?.url ||
      FALLBACK_CHANNEL.avatar,
    url: `https://youtube.com/@${(snippet.customUrl || 'nullhackers').replace(/^@/, '')}`,
    description: snippet.description || FALLBACK_CHANNEL.description,
  };
}

/**
 * Fetch recent uploads from the channel, filter out Shorts,
 * and return two lists: latestVideos (3 newest) and popularVideos (3 most-viewed).
 *
 * Strategy:
 *   1. Get the latest 20 uploads from the uploads playlist.
 *   2. Fetch contentDetails (duration) + statistics (viewCount) for each.
 *   3. Filter out Shorts (duration ≤ 65s).
 *   4. From the long-form set, pick 3 newest → latestVideos.
 *   5. From the remaining long-form set (excluding duplicates), pick 3 most-viewed → popularVideos.
 */
async function fetchVideos() {
  // Every YouTube channel has an "uploads" playlist: replace "UC" prefix with "UU"
  const uploadsPlaylistId = 'UU' + CHANNEL_ID.substring(2);

  // Step 1: Get latest 20 uploads from the playlist (already newest-first)
  const playlistUrl =
    `${YT_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}` +
    `&maxResults=20&key=${API_KEY}`;
  const playlistRes = await fetch(playlistUrl);
  if (!playlistRes.ok) throw new Error(`PlaylistItems API error: ${playlistRes.status}`);
  const playlistData = await playlistRes.json();

  if (!playlistData.items || playlistData.items.length === 0) {
    throw new Error('No videos found');
  }

  const videoIds = playlistData.items
    .map((item) => item.snippet.resourceId.videoId)
    .join(',');

  // Step 2: Get contentDetails (for duration) + statistics (for viewCount)
  const detailsUrl =
    `${YT_API_BASE}/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;
  const detailsRes = await fetch(detailsUrl);
  if (!detailsRes.ok) throw new Error(`Videos API error: ${detailsRes.status}`);
  const detailsData = await detailsRes.json();

  // Build maps: videoId → { viewCount, duration }
  const detailsMap = {};
  if (detailsData.items) {
    for (const item of detailsData.items) {
      detailsMap[item.id] = {
        viewCount: item.statistics?.viewCount || '0',
        duration: item.contentDetails?.duration || '',
      };
    }
  }

  // Step 3: Build enriched list, filtering out Shorts
  const longFormVideos = playlistData.items
    .map((item) => {
      const videoId = item.snippet.resourceId.videoId;
      const details = detailsMap[videoId] || { viewCount: '0', duration: '' };
      return {
        id: videoId,
        title: item.snippet.title,
        rawViews: parseInt(details.viewCount, 10) || 0,
        views: formatViews(details.viewCount),
        date: timeAgo(item.snippet.publishedAt),
        publishedAt: item.snippet.publishedAt,
        duration: details.duration,
      };
    })
    .filter((v) => !isShort(v.duration));

  // Step 4: Latest 3 (playlist is already newest-first, so just take the first 3)
  const latestVideos = longFormVideos.slice(0, 3);
  const latestIds = new Set(latestVideos.map((v) => v.id));

  // Step 5: Popular 3 — from remaining videos (excluding ones already in latest), sorted by views
  const remainingForPopular = longFormVideos.filter((v) => !latestIds.has(v.id));
  const popularVideos = [...remainingForPopular]
    .sort((a, b) => b.rawViews - a.rawViews)
    .slice(0, 3);

  // If we don't have enough unique popular videos (channel has few uploads),
  // fill from the full list sorted by views
  if (popularVideos.length < 3) {
    const popularIds = new Set(popularVideos.map((v) => v.id));
    const allByViews = [...longFormVideos].sort((a, b) => b.rawViews - a.rawViews);
    for (const v of allByViews) {
      if (popularVideos.length >= 3) break;
      if (!popularIds.has(v.id)) {
        popularVideos.push(v);
        popularIds.add(v.id);
      }
    }
  }

  return { latestVideos, popularVideos };
}

/* ═══════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════ */

/**
 * Get YouTube data (channel + videos).
 * Returns cached data if < 12 hours old, otherwise fetches fresh data.
 * Falls back to stale cache or hardcoded defaults on error.
 *
 * @returns {{ channel: object, latestVideos: object[], popularVideos: object[] }}
 */
export async function getYouTubeData() {
  // Check cache first
  const cache = readCache();
  if (cache && isCacheFresh(cache)) {
    return {
      channel: cache.channel,
      latestVideos: cache.latestVideos || cache.videos || [],
      popularVideos: cache.popularVideos || [],
    };
  }

  // No API key → return fallback (or stale cache)
  if (!API_KEY) {
    console.warn(
      '[YouTubeService] No API key found. Set VITE_YOUTUBE_API_KEY in .env'
    );
    if (cache) {
      return {
        channel: cache.channel,
        latestVideos: cache.latestVideos || cache.videos || [],
        popularVideos: cache.popularVideos || [],
      };
    }
    return { channel: FALLBACK_CHANNEL, latestVideos: [], popularVideos: [] };
  }

  // Fetch fresh data
  try {
    const [channel, { latestVideos, popularVideos }] = await Promise.all([
      fetchChannelStats(),
      fetchVideos(),
    ]);

    const result = { channel, latestVideos, popularVideos };
    writeCache(result);
    return result;
  } catch (err) {
    console.error('[YouTubeService] API fetch failed:', err);
    // Fall back to stale cache if available, else hardcoded defaults
    if (cache) {
      return {
        channel: cache.channel,
        latestVideos: cache.latestVideos || cache.videos || [],
        popularVideos: cache.popularVideos || [],
      };
    }
    return { channel: FALLBACK_CHANNEL, latestVideos: [], popularVideos: [] };
  }
}
