import { describe, expect, it } from 'vitest';
import { formatDate, formatMonthYear, readingLabel } from './format';

describe('formatDate', () => {
  it('formats as "Mon D, YYYY"', () => {
    expect(formatDate(new Date('2026-10-09'))).toBe('Oct 9, 2026');
    expect(formatDate(new Date('2024-01-01'))).toBe('Jan 1, 2024');
  });
});

describe('formatMonthYear', () => {
  it('formats as "Mon YYYY"', () => {
    expect(formatMonthYear(new Date('2026-10-09'))).toBe('Oct 2026');
  });
});

describe('readingLabel', () => {
  it('labels minutes', () => {
    expect(readingLabel(4)).toBe('4 min read');
    expect(readingLabel(1)).toBe('1 min read');
  });
});