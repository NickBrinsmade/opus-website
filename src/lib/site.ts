// Numbers on the site come from the live database (pg_class estimates,
// 2026-11-03). Round down; never round up.
export const STATS = {
  works: '13 million',
  recognizable: '2 million',
  artists: '590,000',
  museums: '15,000',
  exhibits: '12,000',
};

export const SITE = {
  name: 'Opus',
  tagline: 'Point your camera at a work of art. Know it in seconds.',
  description:
    'Opus recognizes paintings, sculpture and objects from a photo, then shows you the story behind them, where to see more, and what other visitors thought.',
  email: 'hello@opus-mobile.com',
};

// Publishable key: the same one the app ships with. Row-level security
// decides what it can do. Never put a secret key in this public repo.
export const SUPABASE_URL = 'https://vrkyrldnodmxqxppweim.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_4aOPGlmCWv-N52IGbg3_uQ_Z-Y5WSd_';

// PostHog project key (public by design). Empty = analytics off.
export const POSTHOG_KEY = 'phc_mGg42sg8ZKb28gmhbpqc75xAgU8rXoAs3sRQhwsGD6bb';
export const POSTHOG_HOST = 'https://us.i.posthog.com';

// Cloudflare Web Analytics beacon token (public by design). Empty = off.
// The DNS records are DNS-only, so Cloudflare can't auto-inject it.
export const CF_BEACON_TOKEN = 'd3e3df51a48e4afca776045553ca8332';

export const CATEGORIES: Record<string, string> = {
  recognition: 'Recognizing art',
  museums: 'Visiting museums',
  research: 'Art research',
  reviewing: 'Reviewing art',
};

// Default end-of-guide and sticky-bar CTA wording per guide audience.
// Only promise what the app does for that reader (finders: it won't value
// a painting they own).
export const AUDIENCES: Record<string, { heading: string; body: string; sticky: string }> = {
  travelers: {
    heading: 'Take Opus on your next trip.',
    body: 'Know what you’re looking at from a photo, then find the masterpieces, hidden gems and exhibitions near you. We’re letting testers in now.',
    sticky: 'Take Opus on your trip',
  },
  regulars: {
    heading: 'Rate and review the art you see.',
    body: 'Log the works and exhibitions you see, rate and review them, and follow friends to see what they loved. We’re letting testers in now.',
    sticky: 'Rate and review the art you see',
  },
  students: {
    heading: 'Identify any artwork from a photo.',
    body: 'Opus recognizes paintings and sculpture from a photo and gives you the artist, the date and the museum that holds it. Free during testing.',
    sticky: 'Identify art from a photo',
  },
  families: {
    heading: 'Turn the next museum visit into a game.',
    body: 'Photograph a work and Opus tells you what it is. Every find counts toward badges, so there’s always one more painting to look for. We’re letting testers in now.',
    sticky: 'Make museum visits a game',
  },
  researchers: {
    heading: `${STATS.works} works, in your pocket.`,
    body: `Opus brings together works from ${STATS.museums} museums and collections, searchable by artist, museum or photo. We’re letting testers in now.`,
    sticky: `Search ${STATS.works} artworks`,
  },
  finders: {
    heading: 'Seeing art in a museum?',
    body: 'Opus identifies works in museum and public collections from a photo. It won’t value a painting you own, but in a gallery it tells you exactly what you’re looking at.',
    sticky: 'Identify museum art with your camera',
  },
};

/** Prefix a site-absolute path with the deploy base. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + path;
}
