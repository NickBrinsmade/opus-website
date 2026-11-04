// Internal-link audit for guides. Runs after `astro build` (reads dist/).
//
// For every published guide it reports:
//   - in-body links pointing at it from other guides and pages (related-card
//     blocks, header and footer don't count: only links inside article text);
//   - places where another guide mentions this guide's target keyword (or a
//     close variant) without linking to it: the best spots to add a link.
//
// Never fails the build. `npm run links` re-runs it on the last build.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const SRC = 'src/content/guides';
const base = (process.env.SITE_BASE || '/').replace(/\/$/, '');

if (!existsSync(DIST)) { console.log('link-audit: no dist/, run a build first'); process.exit(0); }

const guides = existsSync(SRC)
  ? readdirSync(SRC).filter((f) => /\.mdx?$/.test(f)).map((f) => {
      const src = readFileSync(join(SRC, f), 'utf8');
      const fm = src.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      const field = (k) => fm.match(new RegExp(`^${k}:\\s*['"]?(.+?)['"]?\\s*$`, 'm'))?.[1] ?? '';
      return { slug: f.replace(/\.mdx?$/, ''), title: field('title'), keyword: field('keyword').toLowerCase() };
    })
  : [];

if (!guides.length) { console.log('link-audit: no published guides yet'); process.exit(0); }

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : []);
}

// The part of a page that counts as "body": article text for guides,
// <main> minus guide cards elsewhere.
function bodyOf(html) {
  const art = html.match(/data-article-body[^>]*>([\s\S]*?)<section class="end-cta/);
  if (art) return art[1];
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  return main.replace(/<a class="card"[\s\S]*?<\/a>/g, '');
}
const text = (html) => html.replace(/<a [\s\S]*?<\/a>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();

const pages = htmlFiles(DIST).map((file) => {
  const html = readFileSync(file, 'utf8');
  const path = '/' + file.slice(DIST.length + 1).replace(/index\.html$/, '');
  const body = bodyOf(html);
  const links = [...body.matchAll(/href="([^"#?]+)/g)].map((m) => m[1].replace(base, '') || '/');
  return { path, body, links, plain: text(body) };
});

// Keyword variants: the full phrase, and the phrase without leading "how to" / "best" etc.
const variants = (k) => [...new Set([k, k.replace(/^(how to|best|what is|the)\s+/, '')].filter((v) => v.split(' ').length >= 2))];

let problems = 0;
console.log('\nInternal links to guides');
for (const g of guides) {
  const target = `/guides/${g.slug}/`;
  const inbound = pages.filter((p) => p.path !== target && p.links.includes(target));
  const spots = pages.filter((p) => p.path !== target && p.path.startsWith('/guides/') && !p.links.includes(target))
    .filter((p) => variants(g.keyword).some((v) => p.plain.includes(v)));
  const flag = inbound.length === 0 ? '  ORPHAN' : '';
  if (flag) problems++;
  console.log(`\n  ${g.slug}  (${inbound.length} in-body link${inbound.length === 1 ? '' : 's'})${flag}`);
  for (const p of inbound) console.log(`    ← ${p.path}`);
  for (const p of spots) console.log(`    + mentions "${g.keyword}" without linking: ${p.path}`);
}
console.log(problems ? `\n${problems} guide(s) have no in-body links pointing at them.\n` : '\nEvery guide has at least one in-body link.\n');
