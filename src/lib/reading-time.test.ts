import { describe, expect, it } from 'vitest';
import { countWords, readingTime } from './reading-time';

describe('countWords', () => {
  it('counts plain words', () => {
    expect(countWords('one two three')).toBe(3);
  });

  it('strips frontmatter', () => {
    const md = '---\ntitle: Hello\n---\nBody text here.';
    expect(countWords(md)).toBe(3);
  });

  it('strips fenced code blocks', () => {
    const md = 'Before\n```go\nfmt.Println("ignore me entirely")\n```\nafter';
    expect(countWords(md)).toBe(2);
  });

  it('strips inline code', () => {
    expect(countWords('use `the_thing()` here')).toBe(2);
  });

  it('keeps link labels, drops urls', () => {
    expect(countWords('[docs](https://example.com/a/very/long/url)')).toBe(1);
  });

  it('strips markdown punctuation', () => {
    expect(countWords('# Heading\n- item **bold**')).toBe(3);
  });

  it('handles empty input', () => {
    expect(countWords('')).toBe(0);
  });
});

describe('readingTime', () => {
  it('is 1 minute for short posts', () => {
    const { minutes } = readingTime('short post', 200);
    expect(minutes).toBe(1);
  });

  it('scales with word count', () => {
    const words = Array.from({ length: 1000 }, (_, i) => `w${i % 100}`).join(' ');
    const { minutes, words: n } = readingTime(words, 200);
    expect(n).toBe(1000);
    expect(minutes).toBe(5);
  });

  it('honors custom wpm', () => {
    const words = Array.from({ length: 100 }, () => 'w').join(' ');
    expect(readingTime(words, 50).minutes).toBe(2);
  });
});