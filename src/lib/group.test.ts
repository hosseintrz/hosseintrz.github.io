import { describe, expect, it } from 'vitest';
import { groupByTag, groupByYear, pickFeatured, uniqueTags, visibleDrafts } from './group';

const d = (iso: string) => new Date(iso);

describe('uniqueTags', () => {
  it('counts and sorts tags alphabetically', () => {
    const tags = uniqueTags([
      { tags: ['golang', 'testing'] },
      { tags: ['golang'] },
      { tags: ['ai-agents'] },
    ]);
    expect(tags).toEqual([
      { tag: 'ai-agents', count: 1 },
      { tag: 'golang', count: 2 },
      { tag: 'testing', count: 1 },
    ]);
  });

  it('returns empty for no posts', () => {
    expect(uniqueTags([])).toEqual([]);
  });
});

describe('groupByTag', () => {
  it('lists a post under each of its tags', () => {
    const posts = [
      { tags: ['a', 'b'], id: '1' },
      { tags: ['b'], id: '2' },
    ];
    const map = groupByTag(posts);
    expect(map.get('a')).toEqual([{ tags: ['a', 'b'], id: '1' }]);
    expect(map.get('b')?.map((p) => p.id)).toEqual(['1', '2']);
  });
});

describe('groupByYear', () => {
  it('groups by year, descending', () => {
    const groups = groupByYear([
      { date: d('2024-03-01'), id: 'a' },
      { date: d('2026-01-01'), id: 'b' },
      { date: d('2024-11-01'), id: 'c' },
    ]);
    expect(groups.map((g) => g.year)).toEqual([2026, 2024]);
    expect(groups[1].items.map((i) => i.id)).toEqual(['a', 'c']);
  });
});

describe('pickFeatured', () => {
  it('returns only featured, up to max', () => {
    const items = [
      { featured: true, id: '1' },
      { featured: false, id: '2' },
      { featured: true, id: '3' },
      { featured: true, id: '4' },
      { featured: true, id: '5' },
    ];
    expect(pickFeatured(items, 2).map((i) => i.id)).toEqual(['1', '3']);
  });
});

describe('visibleDrafts', () => {
  it('keeps everything in dev', () => {
    const items = [{ draft: true, id: '1' }, { draft: false, id: '2' }];
    expect(visibleDrafts(items, true).length).toBe(2);
  });
  it('drops drafts in prod', () => {
    const items = [{ draft: true, id: '1' }, { draft: false, id: '2' }];
    expect(visibleDrafts(items, false).map((i) => i.id)).toEqual(['2']);
  });
  it('treats missing draft flag as visible', () => {
    expect(visibleDrafts([{ draft: false, id: '1' }], false).length).toBe(1);
  });
});