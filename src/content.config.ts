import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections. Every section of the site is driven by these files:
 *   blog      src/content/blog/*.md        (Markdown/MDX posts)
 *   projects  src/content/projects/*.md    (project case studies)
 *   books     src/data/books/*.yml         (one file per book)
 *   papers    src/data/papers/*.yml        (one file per paper)
 *   resume    src/data/resume.yaml         (single resume source of truth)
 *   now       src/content/now/*.md         (single now page)
 *
 * `draft: true` entries render in dev (with a DRAFT badge) and are hidden
 * from production builds — that is how sample/seed content ships safely.
 */

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    status: z.enum(['active', 'shipped', 'archived', 'idea']),
    stack: z.array(z.string()).default([]),
    links: z
      .object({
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
        writeup: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/data/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(['read', 'reading', 'want']),
    rating: z.number().min(1).max(5).optional(),
    dateFinished: z.coerce.date().optional(),
    recommended: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    oneLiner: z.string(),
    /** 0-100 for status: 'reading' — drives the progress ring on /library */
    progress: z.number().min(0).max(100).optional(),
    notesSlug: z.string().optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const papers = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/data/papers' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    year: z.number().int(),
    venue: z.string().optional(),
    url: z.string().url(),
    status: z.enum(['read', 'reading', 'queue']),
    tags: z.array(z.string()).default([]),
    takeaway: z.string(),
    notesSlug: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const resume = defineCollection({
  loader: glob({ pattern: 'resume.yaml', base: './src/data' }),
  schema: z.object({
    basics: z.object({
      name: z.string(),
      role: z.string(),
      tagline: z.string(),
      email: z.string().optional(),
      location: z.string().optional(),
      website: z.string().url().optional(),
      github: z.string().url().optional(),
      photo: z.string().optional(),
    }),
    summary: z.string(),
    experience: z.array(
      z.object({
        company: z.string(),
        location: z.string().optional(),
        teams: z.array(
          z.object({
            name: z.string(),
            period: z.string(),
            summary: z.string().optional(),
            highlights: z.array(z.string()).default([]),
            stack: z.array(z.string()).default([]),
          })
        ),
      })
    ),
    education: z
      .array(
        z.object({
          school: z.string(),
          degree: z.string(),
          period: z.string(),
          details: z.string().optional(),
        })
      )
      .default([]),
    skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })).default([]),
    projects: z
      .array(z.object({ name: z.string(), description: z.string() }))
      .default([]),
    certifications: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    updated: z.coerce.date().optional(),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/now' }),
  schema: z.object({
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, projects, books, papers, resume, now };