import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { sortPostsDesc } from '@/lib/sort';
import { visibleDrafts } from '@/lib/group';
import { site } from '@/config/site';

export const GET: APIRoute = async (context) => {
  const isDev = import.meta.env.DEV;
  const posts = visibleDrafts(sortPostsDesc(await getCollection('blog')), isDev);

  return rss({
    title: `${site.name} — ${site.role}`,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
};