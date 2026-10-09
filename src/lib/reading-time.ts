/**
 * Reading-time estimation from raw markdown.
 * Strips frontmatter, fenced/inline code, and markup noise, then counts words.
 */

export function countWords(markdown: string): number {
  const cleaned = markdown
    .replace(/^---\n[\s\S]*?\n---/, ' ') // frontmatter
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/<[^>]+>/g, ' ') // raw html
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // link targets -> label only
    .replace(/[#*_~>|-]/g, ' '); // markdown punctuation
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export interface ReadingTime {
  minutes: number;
  words: number;
}

/** 200 words/minute default; posts under 1 minute still report 1. */
export function readingTime(markdown: string, wpm = 200): ReadingTime {
  const words = countWords(markdown);
  const minutes = Math.max(1, Math.round(words / wpm));
  return { minutes, words };
}