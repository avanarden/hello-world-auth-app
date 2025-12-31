const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  formatTitle,
  findYearDirectories,
  findBlogPosts,
  generateBlogIndex
} = require('../generate-blog-index');

// Test helpers for filesystem fixtures
let testTempDir;

/**
 * Creates a unique temporary directory for test isolation
 */
function createTempDir() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-test-'));
  return tempDir;
}

/**
 * Creates a blog post file in the specified directory
 * @param {string} baseDir - Base directory path
 * @param {string} year - Year subdirectory
 * @param {string} filename - Full filename (e.g., 'blog-2024-01-15-my-post.md')
 */
function createBlogPost(baseDir, year, filename) {
  const yearDir = path.join(baseDir, year);

  // Create year directory if it doesn't exist
  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir, { recursive: true });
  }

  // Create the blog post file with dummy content
  const filePath = path.join(yearDir, filename);
  fs.writeFileSync(filePath, '# Test Blog Post\n\nContent here.');

  return filePath;
}

/**
 * Recursively removes a directory and all its contents
 */
function cleanupTempDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Cleanup after each test
afterEach(() => {
  if (testTempDir) {
    cleanupTempDir(testTempDir);
    testTempDir = null;
  }
});

describe('formatTitle', () => {
  test('converts simple slug to title case', () => {
    expect(formatTitle('my-first-post')).toBe('My First Post');
  });

  test('handles single word', () => {
    expect(formatTitle('hello')).toBe('Hello');
  });

  test('handles slug with .md extension', () => {
    expect(formatTitle('my-post.md')).toBe('My Post');
  });

  test('handles numbers in slug', () => {
    expect(formatTitle('top-10-tips')).toBe('Top 10 Tips');
  });

  test('handles multiple hyphens', () => {
    expect(formatTitle('a-very-long-post-title')).toBe('A Very Long Post Title');
  });

  test('handles empty string', () => {
    expect(formatTitle('')).toBe('');
  });

  test('handles already capitalized words', () => {
    expect(formatTitle('react-and-node')).toBe('React And Node');
  });
});

describe('findYearDirectories', () => {
  test('finds valid year directories', () => {
    testTempDir = createTempDir();

    // Create valid year directories
    fs.mkdirSync(path.join(testTempDir, '2024'));
    fs.mkdirSync(path.join(testTempDir, '2025'));

    // Create invalid directories that should be ignored
    fs.mkdirSync(path.join(testTempDir, 'invalid'));
    fs.mkdirSync(path.join(testTempDir, '20'));
    fs.mkdirSync(path.join(testTempDir, '12345'));

    // Create a file (not directory) that should be ignored
    fs.writeFileSync(path.join(testTempDir, '2023.txt'), 'test');

    const result = findYearDirectories(testTempDir);

    expect(result).toEqual(['2024', '2025']);
  });

  test('returns empty array when no year directories exist', () => {
    testTempDir = createTempDir();

    // Create only non-year directories
    fs.mkdirSync(path.join(testTempDir, 'posts'));
    fs.mkdirSync(path.join(testTempDir, 'drafts'));

    const result = findYearDirectories(testTempDir);

    expect(result).toEqual([]);
  });

  test('returns empty array when directory does not exist', () => {
    const nonExistentDir = path.join(os.tmpdir(), 'does-not-exist-12345');

    const result = findYearDirectories(nonExistentDir);

    expect(result).toEqual([]);
  });

  test('returns sorted year directories', () => {
    testTempDir = createTempDir();

    // Create years in non-sorted order
    fs.mkdirSync(path.join(testTempDir, '2025'));
    fs.mkdirSync(path.join(testTempDir, '2023'));
    fs.mkdirSync(path.join(testTempDir, '2024'));

    const result = findYearDirectories(testTempDir);

    expect(result).toEqual(['2023', '2024', '2025']);
  });
});

describe('findBlogPosts', () => {
  test('finds correctly named blog posts', () => {
    testTempDir = createTempDir();

    createBlogPost(testTempDir, '2024', 'blog-2024-01-15-my-first-post.md');
    createBlogPost(testTempDir, '2024', 'blog-2024-03-20-another-post.md');

    const result = findBlogPosts(testTempDir, '2024');

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      slug: '2024-01-15-my-first-post',
      title: 'My First Post',
      date: '2024-01-15',
      path: '/2024/blog-2024-01-15-my-first-post.md'
    });
    expect(result[1]).toMatchObject({
      slug: '2024-03-20-another-post',
      title: 'Another Post',
      date: '2024-03-20',
      path: '/2024/blog-2024-03-20-another-post.md'
    });
  });

  test('ignores non-blog markdown files', () => {
    testTempDir = createTempDir();
    const yearDir = path.join(testTempDir, '2024');
    fs.mkdirSync(yearDir, { recursive: true });

    // Create valid blog post
    createBlogPost(testTempDir, '2024', 'blog-2024-01-15-valid.md');

    // Create invalid files that should be ignored
    fs.writeFileSync(path.join(yearDir, 'README.md'), 'content');
    fs.writeFileSync(path.join(yearDir, '2024-01-15-missing-blog-prefix.md'), 'content');
    fs.writeFileSync(path.join(yearDir, 'blog-invalid-date.md'), 'content');
    fs.writeFileSync(path.join(yearDir, 'notes.txt'), 'content');

    const result = findBlogPosts(testTempDir, '2024');

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('2024-01-15-valid');
  });

  test('handles empty year directory', () => {
    testTempDir = createTempDir();
    fs.mkdirSync(path.join(testTempDir, '2024'));

    const result = findBlogPosts(testTempDir, '2024');

    expect(result).toEqual([]);
  });

  test('handles non-existent year directory', () => {
    testTempDir = createTempDir();

    const result = findBlogPosts(testTempDir, '2024');

    expect(result).toEqual([]);
  });

  test('extracts title correctly from slug', () => {
    testTempDir = createTempDir();

    createBlogPost(testTempDir, '2024', 'blog-2024-06-10-react-hooks-guide.md');

    const result = findBlogPosts(testTempDir, '2024');

    expect(result[0].title).toBe('React Hooks Guide');
  });
});
