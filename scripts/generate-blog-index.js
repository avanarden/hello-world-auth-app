#!/usr/bin/env node

/**
 * Blog Index Generator
 *
 * Scans year directories in frontend/public/ for markdown blog posts
 * and generates a blog-index.json file with metadata extracted from filenames.
 *
 * Filename format: blog-YYYY-MM-DD-title-slug.md
 * Directory structure: YYYY/blog-YYYY-MM-DD-title-slug.md
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = path.join(__dirname, '../content/posts');
const PUBLIC_DIR = path.join(__dirname, '../frontend/public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'blog-index.json');
const YEAR_PATTERN = /^\d{4}$/;
const BLOG_FILE_PATTERN = /^blog-(\d{4}-\d{2}-\d{2})-(.*\.md)$/;
const SUMMARY_LENGTH = 150;

/**
 * Formats a slug into a display title
 * Example: "my-first-post" -> "My First Post"
 */
function formatTitle(slug) {
  // Remove .md extension if present
  const cleanSlug = slug.replace(/\.md$/, '');

  return cleanSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Strips markdown syntax from text to produce plain text
 */
function stripMarkdown(markdown) {
  return markdown
    // Remove code blocks (fenced)
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove links, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    // Remove strikethrough
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s?/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove table formatting
    .replace(/\|/g, ' ')
    .replace(/^[-:\s|]+$/gm, '')
    // Remove task list markers
    .replace(/- \[[ x]\]\s*/g, '')
    // Remove unordered list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    // Remove ordered list markers
    .replace(/^\s*\d+\.\s+/gm, '')
    // Collapse multiple spaces
    .replace(/[ \t]+/g, ' ')
    // Collapse multiple newlines
    .replace(/\n{2,}/g, ' ')
    // Replace remaining newlines with spaces
    .replace(/\n/g, ' ')
    .trim();
}

/**
 * Extracts a summary from plain text, truncating at a word boundary
 */
function extractSummary(text, maxLength) {
  if (!text || text.length === 0) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  // Truncate at maxLength, then find the last space to get a word boundary
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace === -1) {
    return truncated + '...';
  }

  return truncated.slice(0, lastSpace) + '...';
}

/**
 * Copies blog post files from content/posts/ to frontend/public/
 * preserving the year directory structure
 */
function copyPostsToPublic(contentDir, publicDir) {
  if (!fs.existsSync(contentDir)) {
    console.warn(`Warning: Content directory not found: ${contentDir}`);
    return;
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const yearDirs = entries
    .filter(entry => entry.isDirectory())
    .filter(entry => YEAR_PATTERN.test(entry.name));

  for (const yearDir of yearDirs) {
    const srcYear = path.join(contentDir, yearDir.name);
    const destYear = path.join(publicDir, yearDir.name);

    if (!fs.existsSync(destYear)) {
      fs.mkdirSync(destYear, { recursive: true });
    }

    const files = fs.readdirSync(srcYear);
    for (const file of files) {
      if (file.match(BLOG_FILE_PATTERN)) {
        fs.copyFileSync(
          path.join(srcYear, file),
          path.join(destYear, file)
        );
      }
    }
  }

  console.log(`Copied posts from ${contentDir} to ${publicDir}`);
}

/**
 * Scans a directory and returns all subdirectories matching the year pattern
 */
function findYearDirectories(publicDir) {
  try {
    const entries = fs.readdirSync(publicDir, { withFileTypes: true });

    return entries
      .filter(entry => entry.isDirectory())
      .filter(entry => YEAR_PATTERN.test(entry.name))
      .map(entry => entry.name)
      .sort();
  } catch (error) {
    console.error(`Error reading public directory: ${error.message}`);
    return [];
  }
}

/**
 * Scans a year directory for blog post markdown files
 */
function findBlogPosts(publicDir, year) {
  const yearDir = path.join(publicDir, year);
  const posts = [];

  try {
    const files = fs.readdirSync(yearDir);

    for (const file of files) {
      const match = file.match(BLOG_FILE_PATTERN);

      if (match) {
        const date = match[1];
        const slugWithExt = match[2];
        const slug = slugWithExt.replace(/\.md$/, '');
        const title = formatTitle(slug);
        const fullSlug = `${date}-${slug}`;

        // Read file content and generate summary
        let summary = '';
        try {
          const filePath = path.join(publicDir, year, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const plainText = stripMarkdown(content);
          summary = extractSummary(plainText, SUMMARY_LENGTH);
        } catch (err) {
          console.warn(`Warning: Could not read ${file} for summary: ${err.message}`);
        }

        posts.push({
          slug: fullSlug,
          title: title,
          date: date,
          path: `/${year}/${file}`,
          summary: summary
        });
      }
    }
  } catch (error) {
    console.error(`Error reading year directory ${year}: ${error.message}`);
  }

  return posts;
}

/**
 * Main function to generate blog index
 */
function generateBlogIndex() {
  console.log('Generating blog index...');

  // Copy posts from source-controlled content directory to public
  copyPostsToPublic(CONTENT_DIR, PUBLIC_DIR);

  console.log(`Scanning directory: ${PUBLIC_DIR}`);

  // Find all year directories
  const yearDirs = findYearDirectories(PUBLIC_DIR);

  if (yearDirs.length === 0) {
    console.warn('Warning: No year directories found');
    // Write empty array to maintain valid JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    console.log(`Created empty index at: ${OUTPUT_FILE}`);
    return;
  }

  console.log(`Found year directories: ${yearDirs.join(', ')}`);

  // Collect all blog posts from all year directories
  const allPosts = [];

  for (const year of yearDirs) {
    const posts = findBlogPosts(PUBLIC_DIR, year);
    console.log(`Found ${posts.length} post(s) in ${year}/`);
    allPosts.push(...posts);
  }

  if (allPosts.length === 0) {
    console.warn('Warning: No blog posts found');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    console.log(`Created empty index at: ${OUTPUT_FILE}`);
    return;
  }

  // Sort posts by date descending (newest first)
  allPosts.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Write to JSON file with 2-space indentation
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allPosts, null, 2));

  console.log(`Successfully generated index with ${allPosts.length} post(s)`);
  console.log(`Output file: ${OUTPUT_FILE}`);
}

// Export functions for testing
module.exports = {
  formatTitle,
  stripMarkdown,
  extractSummary,
  copyPostsToPublic,
  findYearDirectories,
  findBlogPosts,
  generateBlogIndex
};

// Only run if executed directly (not when required by tests)
if (require.main === module) {
  try {
    generateBlogIndex();
    process.exit(0);
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}
