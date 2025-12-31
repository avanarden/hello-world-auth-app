import { formatBlogTitle } from '../blogUtils';

describe('formatBlogTitle', () => {
  test('removes date prefix and formats title', () => {
    expect(formatBlogTitle('2024-01-15-my-first-post')).toBe('My First Post');
  });

  test('formats slug without date prefix', () => {
    expect(formatBlogTitle('hello-world')).toBe('Hello World');
  });

  test('handles single word', () => {
    expect(formatBlogTitle('introduction')).toBe('Introduction');
  });

  test('handles multiple hyphens', () => {
    expect(formatBlogTitle('this-is-a-long-title')).toBe('This Is A Long Title');
  });
});
