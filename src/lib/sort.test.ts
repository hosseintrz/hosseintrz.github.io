import { describe, expect, it } from 'vitest';
import { sortBooks, sortPapersByYearDesc, sortPostsDesc, sortProjects } from './sort';

const d = (iso: string) => new Date(iso);
// collection-entry-like shape
const e = <T,>(data: T) => ({ data });

describe('sortPostsDesc', () => {
  it('sorts newest first without mutating input', () => {
    const input = [
      e({ date: d('2024-01-01'), id: 'old' }),
      e({ date: d('2026-01-01'), id: 'new' }),
      e({ date: d('2025-01-01'), id: 'mid' }),
    ];
    const sorted = sortPostsDesc(input);
    expect(sorted.map((p) => p.data.id)).toEqual(['new', 'mid', 'old']);
    expect(input.map((p) => p.data.id)).toEqual(['old', 'new', 'mid']);
  });
});

describe('sortProjects', () => {
  it('orders explicit order first, ascending', () => {
    const sorted = sortProjects([
      e({ date: d('2026-01-01'), order: 2, id: 'b' }),
      e({ date: d('2026-06-01'), order: 1, id: 'a' }),
    ]);
    expect(sorted.map((p) => p.data.id)).toEqual(['a', 'b']);
  });

  it('puts ordered items before unordered', () => {
    const sorted = sortProjects([
      e({ date: d('2026-12-01'), id: 'recent' }),
      e({ date: d('2020-01-01'), order: 1, id: 'pinned' }),
    ]);
    expect(sorted.map((p) => p.data.id)).toEqual(['pinned', 'recent']);
  });

  it('falls back to date desc for unordered items', () => {
    const sorted = sortProjects([
      e({ date: d('2024-01-01'), id: 'x' }),
      e({ date: d('2025-05-01'), id: 'y' }),
    ]);
    expect(sorted.map((p) => p.data.id)).toEqual(['y', 'x']);
  });
});

describe('sortPapersByYearDesc', () => {
  it('sorts by year desc, ties by title', () => {
    const sorted = sortPapersByYearDesc([
      e({ year: 2024, title: 'b', id: '1' }),
      e({ year: 2025, title: 'z', id: '2' }),
      e({ year: 2024, title: 'a', id: '3' }),
    ]);
    expect(sorted.map((p) => p.data.id)).toEqual(['2', '3', '1']);
  });
});

describe('sortBooks', () => {
  it('groups reading > read > want, newest finish first within groups', () => {
    const sorted = sortBooks([
      e({ status: 'read', dateFinished: d('2025-01-01'), id: 'r1' }),
      e({ status: 'want', id: 'w' }),
      e({ status: 'reading', id: 'g' }),
      e({ status: 'read', dateFinished: d('2026-01-01'), id: 'r2' }),
    ]);
    expect(sorted.map((b) => b.data.id)).toEqual(['g', 'r2', 'r1', 'w']);
  });

  it('handles books without finish dates', () => {
    const sorted = sortBooks([
      e({ status: 'read', id: 'a' }),
      e({ status: 'read', dateFinished: d('2024-01-01'), id: 'b' }),
    ]);
    expect(sorted.map((b) => b.data.id)).toEqual(['b', 'a']);
  });
});