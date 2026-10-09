/** Pure grouping/filtering helpers. Operate on collection entry shape ({ data: {...} }). */

/** All distinct tags, sorted alphabetically, with usage counts. */
export function uniqueTags<T extends { data: { tags: string[] } }>(
  posts: T[]
): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

/** Posts grouped by tag (a post with N tags appears under all N). */
export function groupByTag<T extends { data: { tags: string[] } }>(posts: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const list = map.get(tag) ?? [];
      list.push(post);
      map.set(tag, list);
    }
  }
  return map;
}

/** Items grouped by calendar year (descending years). */
export function groupByYear<T extends { data: { date: Date } }>(
  items: T[]
): Array<{ year: number; items: T[] }> {
  const map = new Map<number, T[]>();
  for (const item of items) {
    const year = item.data.date.getFullYear();
    const list = map.get(year) ?? [];
    list.push(item);
    map.set(year, list);
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, items: list }));
}

export function pickFeatured<T extends { data: { featured: boolean } }>(
  items: T[],
  max = 3
): T[] {
  return items.filter((i) => i.data.featured).slice(0, max);
}

/** Production-only filter: drop drafts outside dev (drafts always show in dev). */
export function visibleDrafts<T>(items: T[], isDev: boolean): T[] {
  if (isDev) return items;
  return items.filter(
    (i) => (i as { data?: { draft?: boolean } }).data?.draft !== true
  );
}