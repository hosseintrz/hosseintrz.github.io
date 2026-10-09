/** Pure sorting helpers for content collections. */

export function byDateDesc<T extends { date: Date }>(a: T, b: T): number {
  return b.date.getTime() - a.date.getTime();
}

/** Posts, newest first. */
export function sortPostsDesc<T extends { date: Date }>(items: T[]): T[] {
  return [...items].sort(byDateDesc);
}

/**
 * Projects: explicit `order` wins (ascending); ordered items come before
 * unordered; unordered fall back to date, newest first.
 */
export function sortProjects<T extends { date: Date; order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ao = a.order ?? null;
    const bo = b.order ?? null;
    if (ao !== null && bo !== null && ao !== bo) return ao - bo;
    if (ao !== null && bo === null) return -1;
    if (bo !== null && ao === null) return 1;
    return byDateDesc(a, b);
  });
}

/** Papers, newest year first; ties broken by title. */
export function sortPapersByYearDesc<T extends { year: number; title: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

/** Books: finished books by finish date (newest first), then reading, then want-to-read. */
export function sortBooks<T extends { status: string; dateFinished?: Date }>(items: T[]): T[] {
  const rank: Record<string, number> = { reading: 0, read: 1, want: 2 };
  return [...items].sort((a, b) => {
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    const ad = a.dateFinished?.getTime() ?? 0;
    const bd = b.dateFinished?.getTime() ?? 0;
    return bd - ad;
  });
}