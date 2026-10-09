import { describe, expect, it } from 'vitest';
import { sortBooks, sortPapersByYearDesc, sortPostsDesc, sortProjects } from './sort';

const d = (iso: string) => new Date(iso);

describe('sortPostsDesc', () => {
  it('sorts newest first without mutating input', () => {
    const input = [
      { date: d('2024-01-01'), id: 'old' },
      { date: d('2026-01-01'), id: 'new' },
      { date: d('2025-01-01'), id: 'mid' },
    ];
    const sorted = sortPostsDesc(input);
    expect(sorted.map((p) => p.id)).toEqual(['new', 'mid', 'old']);
    expect(input.map((p) => p.id)).toEqual(['old', 'new', 'mid']);
  });
});

describe('sortProjects', () => {
  it('orders explicit order first, ascending', () => {
    const sorted = sortProjects([
      { date: d('2026-01-01'), order: 2, id: 'b' },
      { date: d('2026-06-01'), order: 1, id: 'a' },
    ]);
    expect(sorted.map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('puts ordered items before unordered', () => {
    const sorted = sortProjects([
      { date: d('2026-12-01'), id: 'recent' },
      { date: d('2020-01-01'), order: 1, id: 'pinned' },
    ]);
    expect(sorted.map((p) => p.id)).toEqual(['pinned', 'recent']);
  });

  it('falls back to date desc for unordered items', () => {
    const sorted = sortProjects([
      { date: d('2024-01-01'), id: 'x' },
      { date: d('2025-05-01'), id: 'y' },
    ]);
    expect(sorted.map((p) => p.id)).toEqual(['y', 'x']);
  });
});

describe('sortPapersByYearDesc', () => {
  it('sorts by year desc, ties by title', () => {
    const sorted = sortPapersByYearDesc([
      { year: 2024, title: 'b', id: '1' },
      { year: 2025, title: 'z', id: '2' },
      { year: 2024, title: 'a', id: '3' },
    ]);
    expect(sorted.map((p) => p.id)).toEqual(['2', '3', '1']);
  });
});

describe('sortBooks', () => {
  it('groups reading > read > want, newest finish first within groups', () => {
    const sorted = sortBooks([
      { status: 'read', dateFinished: d('2025-01-01'), id: 'r1' },
      { status: 'want', id: 'w' },
      { status: 'reading', id: 'g' },
      { status: 'read', dateFinished: d('2026-01-01'), id: 'r2' },
    ]);
    expect(sorted.map((b) => b.id)).toEqual(['g', 'r2', 'r1', 'w']);
  });

  it('handles books without finish dates', () => {
    const sorted = sortBooks([
      { status: 'read', id: 'a' },
      { status: 'read', dateFinished: d('2024-01-01'), id: 'b' },
    ]);
    expect(sorted.map((b) => b.id)).toEqual(['b', 'a']);
  });
});