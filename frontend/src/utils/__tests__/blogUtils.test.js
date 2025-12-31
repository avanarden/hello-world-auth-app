import { formatBlogTitle, formatDate } from '../blogUtils';

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

describe('formatDate', () => {
  test('formats ISO date correctly', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
  });

  test('handles different months', () => {
    expect(formatDate('2024-12-31')).toBe('December 31, 2024');
  });

  test('formats date at start of year', () => {
    expect(formatDate('2024-01-01')).toBe('January 1, 2024');
  });
});
