import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { visibleDrafts } from '@/lib/group';

/**
 * Manifest consumed by scripts/postbuild.mjs: every /og/<slug>/ card page
 * to screenshot into /og/<slug>.png.
 */
export const GET: APIRoute = async () => {
  const isDev = import.meta.env.DEV;
  const posts = visibleDrafts(await getCollection('blog'), isDev);
  const projects = visibleDrafts(await getCollection('projects'), isDev);

  const items = [
    { slug: 'default' },
    ...posts.map((p) => ({ slug: `blog/${p.id}` })),
    ...projects.map((p) => ({ slug: `projects/${p.id}` })),
  ];

  return new Response(
    JSON.stringify({
      size: { width: 1200, height: 630 },
      items: items.map((i) => ({ html: `/og/${i.slug}/`, png: `/og/${i.slug}.png` })),
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
};