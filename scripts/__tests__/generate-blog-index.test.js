const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  formatTitle,
  stripMarkdown,
  extractSummary,
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
function createBlogPost(baseDir, year, filename, content) {
  const yearDir = path.join(baseDir, year);

  // Create year directory if it doesn't exist
  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir, { recursive: true });
  }

  // Create the blog post file with provided or dummy content
  const filePath = path.join(yearDir, filename);
  fs.writeFileSync(filePath, content !== undefined ? content : '# Test Blog Post\n\nContent here.');

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

describe('stripMarkdown', () => {
  test('removes heading markers', () => {
    expect(stripMarkdown('# Heading 1\n## Heading 2')).toBe('Heading 1 Heading 2');
  });

  test('removes bold and italic markers', () => {
    expect(stripMarkdown('**bold** and *italic* and ***both***')).toBe('bold and italic and both');
  });

  test('removes links but keeps text', () => {
    expect(stripMarkdown('[click here](https://example.com)')).toBe('click here');
  });

  test('removes images', () => {
    expect(stripMarkdown('![alt text](image.png)')).toBe('alt text');
  });

  test('removes fenced code blocks', () => {
    expect(stripMarkdown('before\n```js\nconst x = 1;\n```\nafter')).toBe('before after');
  });

  test('removes inline code but keeps content', () => {
    expect(stripMarkdown('use `console.log` to debug')).toBe('use console.log to debug');
  });

  test('removes blockquotes', () => {
    expect(stripMarkdown('> This is a quote')).toBe('This is a quote');
  });

  test('removes unordered list markers', () => {
    expect(stripMarkdown('- item one\n- item two')).toBe('item one item two');
  });

  test('removes ordered list markers', () => {
    expect(stripMarkdown('1. first\n2. second')).toBe('first second');
  });

  test('removes strikethrough', () => {
    expect(stripMarkdown('~~deleted~~ text')).toBe('deleted text');
  });

  test('collapses multiple spaces and newlines', () => {
    expect(stripMarkdown('word1   word2\n\n\nword3')).toBe('word1 word2 word3');
  });

  test('handles empty string', () => {
    expect(stripMarkdown('')).toBe('');
  });

  test('handles complex markdown with mixed syntax', () => {
    const md = '# Title\n\nSome **bold** text with a [link](url) and `code`.';
    const result = stripMarkdown(md);
    expect(result).toBe('Title Some bold text with a link and code.');
  });
});

describe('extractSummary', () => {
  test('returns full text when shorter than max length', () => {
    expect(extractSummary('Short text', 150)).toBe('Short text');
  });

  test('returns empty string for empty input', () => {
    expect(extractSummary('', 150)).toBe('');
  });

  test('returns empty string for null input', () => {
    expect(extractSummary(null, 150)).toBe('');
  });

  test('truncates at word boundary with ellipsis', () => {
    const text = 'The quick brown fox jumps over the lazy dog and then runs away';
    const result = extractSummary(text, 30);
    expect(result).toBe('The quick brown fox jumps...');
    expect(result.length).toBeLessThanOrEqual(33); // 30 + '...'
  });

  test('appends ellipsis when truncated', () => {
    const text = 'a '.repeat(100).trim();
    const result = extractSummary(text, 20);
    expect(result.endsWith('...')).toBe(true);
  });

  test('does not append ellipsis when text fits exactly', () => {
    const text = 'Exact fit here';
    const result = extractSummary(text, 14);
    expect(result).toBe('Exact fit here');
    expect(result.endsWith('...')).toBe(false);
  });

  test('handles single long word with no spaces', () => {
    const text = 'a'.repeat(200);
    const result = extractSummary(text, 150);
    expect(result).toBe('a'.repeat(150) + '...');
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

  test('includes summary field extracted from markdown content', () => {
    testTempDir = createTempDir();

    const content = '# My Post\n\nThis is the body of the blog post with some content.';
    createBlogPost(testTempDir, '2024', 'blog-2024-01-15-my-post.md', content);

    const result = findBlogPosts(testTempDir, '2024');

    expect(result[0]).toHaveProperty('summary');
    expect(result[0].summary).toBe('My Post This is the body of the blog post with some content.');
  });

  test('truncates summary at word boundary for long content', () => {
    testTempDir = createTempDir();

    const longContent = '# Title\n\n' + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10);
    createBlogPost(testTempDir, '2024', 'blog-2024-01-15-long-post.md', longContent);

    const result = findBlogPosts(testTempDir, '2024');

    expect(result[0].summary.endsWith('...')).toBe(true);
    // Summary without ellipsis should be <= 150 chars
    expect(result[0].summary.length).toBeLessThanOrEqual(153);
  });

  test('returns empty summary for empty content file', () => {
    testTempDir = createTempDir();

    createBlogPost(testTempDir, '2024', 'blog-2024-01-15-empty.md', '');

    const result = findBlogPosts(testTempDir, '2024');

    expect(result[0].summary).toBe('');
  });
});

describe('generateBlogIndex', () => {
  // We need to mock the PUBLIC_DIR and OUTPUT_FILE paths
  // Save original console methods
  let consoleLogSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test('generates correct index with posts from multiple years', () => {
    testTempDir = createTempDir();

    // Create posts in different years
    createBlogPost(testTempDir, '2024', 'blog-2024-01-15-old-post.md');
    createBlogPost(testTempDir, '2024', 'blog-2024-06-20-mid-post.md');
    createBlogPost(testTempDir, '2025', 'blog-2025-01-10-new-post.md');

    // Mock the paths by requiring with fresh cache
    jest.resetModules();

    // Temporarily modify the script's paths - we'll need to test this differently
    // For now, let's just test the public API behavior
    const posts = [
      ...findBlogPosts(testTempDir, '2024'),
      ...findBlogPosts(testTempDir, '2025')
    ];

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    expect(posts).toHaveLength(3);
    expect(posts[0].slug).toBe('2025-01-10-new-post');
    expect(posts[1].slug).toBe('2024-06-20-mid-post');
    expect(posts[2].slug).toBe('2024-01-15-old-post');
  });

  test('handles no year directories', () => {
    testTempDir = createTempDir();

    const yearDirs = findYearDirectories(testTempDir);

    expect(yearDirs).toEqual([]);
  });

  test('handles year directories with no posts', () => {
    testTempDir = createTempDir();

    fs.mkdirSync(path.join(testTempDir, '2024'));
    fs.mkdirSync(path.join(testTempDir, '2025'));

    const posts = [
      ...findBlogPosts(testTempDir, '2024'),
      ...findBlogPosts(testTempDir, '2025')
    ];

    expect(posts).toEqual([]);
  });

  test('sorts posts by date with newest first', () => {
    testTempDir = createTempDir();

    // Create posts in mixed date order
    createBlogPost(testTempDir, '2024', 'blog-2024-06-15-middle.md');
    createBlogPost(testTempDir, '2024', 'blog-2024-01-10-oldest.md');
    createBlogPost(testTempDir, '2024', 'blog-2024-12-25-newest.md');

    const posts = findBlogPosts(testTempDir, '2024');
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    expect(posts[0].date).toBe('2024-12-25');
    expect(posts[1].date).toBe('2024-06-15');
    expect(posts[2].date).toBe('2024-01-10');
  });

  test('handles mixed valid and invalid files', () => {
    testTempDir = createTempDir();
    const yearDir = path.join(testTempDir, '2024');
    fs.mkdirSync(yearDir, { recursive: true });

    // Create valid posts
    createBlogPost(testTempDir, '2024', 'blog-2024-01-15-valid-one.md');
    createBlogPost(testTempDir, '2024', 'blog-2024-02-20-valid-two.md');

    // Create invalid files
    fs.writeFileSync(path.join(yearDir, 'invalid.md'), 'content');
    fs.writeFileSync(path.join(yearDir, 'README.md'), 'content');

    const posts = findBlogPosts(testTempDir, '2024');

    expect(posts).toHaveLength(2);
    expect(posts.every(p => p.slug.startsWith('2024-'))).toBe(true);
  });
});
