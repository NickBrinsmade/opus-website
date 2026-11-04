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
export const POSTHOG_KEY = '';
export const POSTHOG_HOST = 'https://us.i.posthog.com';

export const CATEGORIES: Record<string, string> = {
  recognition: 'Recognizing art',
  museums: 'Visiting museums',
  research: 'Art research',
  reviewing: 'Reviewing art',
};

/** Prefix a site-absolute path with the deploy base. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + path;
}
