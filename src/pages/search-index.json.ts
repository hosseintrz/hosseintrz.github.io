import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { visibleDrafts } from '@/lib/group';

interface Entry {
  title: string;
  url: string;
  type: string;
  hint?: string;
}

export const GET: APIRoute = async () => {
  const isDev = import.meta.env.DEV;
  const posts = visibleDrafts(await getCollection('blog'), isDev);
  const projects = visibleDrafts(await getCollection('projects'), isDev);
  const books = visibleDrafts(await getCollection('books'), isDev);
  const papers = visibleDrafts(await getCollection('papers'), isDev);

  const entries: Entry[] = [
    { title: 'Home', url: '/', type: 'page' },
    { title: 'About', url: '/about/', type: 'page' },
    { title: 'Blog', url: '/blog/', type: 'page' },
    { title: 'Projects', url: '/projects/', type: 'page' },
    { title: 'Library', url: '/library/', type: 'page' },
    { title: 'Books', url: '/library/books/', type: 'page' },
    { title: 'Papers', url: '/library/papers/', type: 'page' },
    { title: 'Now', url: '/now/', type: 'page' },
    { title: 'Resume', url: '/resume/', type: 'page' },
    { title: 'Uses', url: '/uses/', type: 'page' },
    { title: 'RSS feed', url: '/rss.xml', type: 'page' },
    ...posts.map((p) => ({
      title: p.data.title,
      url: `/blog/${p.id}/`,
      type: 'post',
      hint: p.data.tags.join(', '),
    })),
    ...projects.map((p) => ({
      title: p.data.title,
      url: `/projects/${p.id}/`,
      type: 'project',
      hint: p.data.stack.join(', '),
    })),
    ...books.map((b) => ({
      title: b.data.title,
      url: '/library/books/',
      type: 'book',
      hint: b.data.author,
    })),
    ...papers.map((p) => ({
      title: p.data.title,
      url: '/library/papers/',
      type: 'paper',
      hint: `${p.data.year}${p.data.venue ? ` · ${p.data.venue}` : ''}`,
    })),
  ];

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};