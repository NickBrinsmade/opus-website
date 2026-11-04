// Reading-depth and CTA analytics.
//
// Events (all carry `path`):
//   page_view
//   read_depth     {pct: 25|50|75|90|100}     share of the article body scrolled past
//   section_reach  {index, heading}           an article H2 entered the viewport
//   cta_view       {placement}                a CTA was at least half on screen
//   cta_click      {placement}                a CTA link was clicked
//   access_submit  {placement, platform}      sent from access-form.ts
//
// With a PostHog key set in lib/site.ts they go to PostHog; without one
// they only collect in window.__opus.events (handy while testing).

type Props = Record<string, string | number | boolean | undefined>;
declare global {
  interface Window {
    __opus: { events: { event: string; props: Props }[]; key: string; host: string };
    posthog?: { capture: (e: string, p?: Props) => void; init: (k: string, o: object) => void };
  }
}

export function track(event: string, props: Props = {}) {
  const full = { path: location.pathname, ...props };
  window.__opus.events.push({ event, props: full });
  window.posthog?.capture(event, full);
}

async function loadPosthog() {
  const { key, host } = window.__opus;
  if (!key) return;
  // Loaded only when a key is configured; no cookies (memory persistence).
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/posthog-js@1.262.0/dist/array.full.js';
  s.async = true;
  s.onload = () => {
    window.posthog?.init(key, { api_host: host, persistence: 'memory', autocapture: false, capture_pageview: false });
    // Replay anything recorded before the library arrived.
    for (const e of window.__opus.events) window.posthog?.capture(e.event, e.props);
  };
  document.head.appendChild(s);
}

function watchArticle() {
  const body = document.querySelector<HTMLElement>('[data-article-body]');
  if (!body) return;
  const marks = [25, 50, 75, 90, 100];
  const sent = new Set<number>();
  const onScroll = () => {
    const r = body.getBoundingClientRect();
    const seen = window.innerHeight - r.top;
    const pct = Math.max(0, Math.min(100, (seen / r.height) * 100));
    for (const m of marks) if (pct >= m && !sent.has(m)) { sent.add(m); track('read_depth', { pct: m }); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const heads = [...body.querySelectorAll('h2')];
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      io.unobserve(en.target);
      track('section_reach', { index: heads.indexOf(en.target as HTMLHeadingElement) + 1, heading: en.target.textContent?.trim() });
    }
  });
  heads.forEach((h) => io.observe(h));
}

function watchCtas() {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      io.unobserve(en.target);
      track('cta_view', { placement: (en.target as HTMLElement).dataset.cta });
    }
  }, { threshold: 0.5 });
  document.querySelectorAll<HTMLElement>('[data-cta]').forEach((el) => io.observe(el));
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLElement>('a[data-cta]');
    if (a) track('cta_click', { placement: a.dataset.cta });
  });
}

track('page_view', { referrer: document.referrer || undefined });
loadPosthog();
watchArticle();
watchCtas();
