import { getCollection, type CollectionEntry } from 'astro:content';

export type Guide = CollectionEntry<'guides'> | CollectionEntry<'drafts'>;

/** Published guides, plus drafts when running the dev server. Newest first. */
export async function allGuides(): Promise<Guide[]> {
  const live: Guide[] = await getCollection('guides');
  const drafts: Guide[] = import.meta.env.DEV ? await getCollection('drafts') : [];
  return [...live, ...drafts].sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

export const isDraft = (g: Guide) => g.collection === 'drafts';

export function readingMinutes(body = ''): number {
  const words = body.replace(/<[^>]+>|import .*|\{[^}]*\}/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
