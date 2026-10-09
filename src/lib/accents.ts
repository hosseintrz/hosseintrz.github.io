export const ACCENTS = [
  { id: 'violet', label: 'Violet' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'lime', label: 'Lime' },
  { id: 'amber', label: 'Amber' },
  { id: 'rose', label: 'Rose' },
  { id: 'mono', label: 'Mono' },
] as const;

export type AccentId = (typeof ACCENTS)[number]['id'];