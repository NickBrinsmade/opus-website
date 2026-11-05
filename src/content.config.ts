import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const schema = z.object({
    title: z.string(),
    // Search snippet. Keep it under ~155 characters.
    description: z.string().max(170),
    dek: z.string(),
    // The query this guide is built to answer (from keyword research / Search Console).
    keyword: z.string(),
    category: z.enum(['recognition', 'museums', 'research', 'reviewing']),
    // Who the guide is written for. Picks the end and sticky CTA wording
    // (AUDIENCES in lib/site.ts) and tags every analytics event.
    audience: z.enum(['travelers', 'regulars', 'students', 'families', 'researchers', 'finders']),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Nick Brinsmade'),
    hero: z.object({ src: z.string(), alt: z.string(), credit: z.string() }).optional(),
    // Slugs of guides this one should be shown next to. The link audit
    // checks that every guide has inbound links from somewhere.
    related: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema,
});

// Unapproved drafts live outside this public repo (opus-project/guide-drafts)
// and only render in `npm run dev`. Approving = moving the file into
// src/content/guides.
const drafts = defineCollection({
  loader: glob({ pattern: ['**/*.{md,mdx}', '!PLAN.md', '!APP_TEST.md'], base: '../guide-drafts' }),
  schema,
});

export const collections = { guides, drafts };
