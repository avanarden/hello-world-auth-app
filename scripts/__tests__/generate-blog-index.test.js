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
