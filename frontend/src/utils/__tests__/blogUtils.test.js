import { formatBlogTitle, formatDate, sortByDateDesc } from '../blogUtils';

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

describe('sortByDateDesc', () => {
  test('sorts posts newest first', () => {
    const posts = [
      { date: '2024-01-15', title: 'Old' },
      { date: '2024-12-30', title: 'New' },
      { date: '2024-06-10', title: 'Middle' }
    ];
    const sorted = sortByDateDesc(posts);
    expect(sorted[0].title).toBe('New');
    expect(sorted[1].title).toBe('Middle');
    expect(sorted[2].title).toBe('Old');
  });

  test('does not mutate original array', () => {
    const posts = [{ date: '2024-01-01' }, { date: '2024-12-01' }];
    const original = [...posts];
    sortByDateDesc(posts);
    expect(posts).toEqual(original);
  });

  test('handles empty array', () => {
    expect(sortByDateDesc([])).toEqual([]);
  });

  test('handles single post', () => {
    const posts = [{ date: '2024-01-15', title: 'Only' }];
    const sorted = sortByDateDesc(posts);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].title).toBe('Only');
  });
});
