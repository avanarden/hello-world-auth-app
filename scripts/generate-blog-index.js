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
const PUBLIC_DIR = path.join(__dirname, '../frontend/public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'blog-index.json');
const YEAR_PATTERN = /^\d{4}$/;
const BLOG_FILE_PATTERN = /^blog-(\d{4}-\d{2}-\d{2})-(.*\.md)$/;

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

        posts.push({
          slug: fullSlug,
          title: title,
          date: date,
          path: `/${year}/${file}`
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
