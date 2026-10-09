/** Pure sorting helpers. Operate on Astro collection entry shape ({ data: {...} }). */

export function byDateDesc<T extends { data: { date: Date } }>(a: T, b: T): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

/** Posts, newest first. */
export function sortPostsDesc<T extends { data: { date: Date } }>(items: T[]): T[] {
  return [...items].sort(byDateDesc);
}

/**
 * Projects: explicit `order` wins (ascending); ordered items come before
 * unordered; unordered fall back to date, newest first.
 */
export function sortProjects<T extends { data: { date: Date; order?: number } }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const ao = a.data.order ?? null;
    const bo = b.data.order ?? null;
    if (ao !== null && bo !== null && ao !== bo) return ao - bo;
    if (ao !== null && bo === null) return -1;
    if (bo !== null && ao === null) return 1;
    return byDateDesc(a, b);
  });
}

/** Papers, newest year first; ties broken by title. */
export function sortPapersByYearDesc<T extends { data: { year: number; title: string } }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title)
  );
}

/** Books: reading first, then read by finish date (newest first), then want-to-read. */
export function sortBooks<T extends { data: { status: string; dateFinished?: Date } }>(
  items: T[]
): T[] {
  const rank: Record<string, number> = { reading: 0, read: 1, want: 2 };
  return [...items].sort((a, b) => {
    if (rank[a.data.status] !== rank[b.data.status]) return rank[a.data.status] - rank[b.data.status];
    const ad = a.data.dateFinished?.getTime() ?? 0;
    const bd = b.data.dateFinished?.getTime() ?? 0;
    return bd - ad;
  });
}