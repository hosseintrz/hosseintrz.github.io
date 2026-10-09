const DATE_FMT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

/** "Oct 9, 2026" */
export function formatDate(date: Date): string {
  return DATE_FMT.format(date);
}

/** "Oct 2026" */
export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
}

/** "4 min read" / "1 min read" */
export function readingLabel(minutes: number): string {
  return `${minutes} min read`;
}