/**
 * Blog utility functions for formatting and processing blog data
 */

/**
 * Converts a slug to a formatted title
 * Example: "my-first-post" -> "My First Post"
 * @param {string} slug - The blog post slug
 * @returns {string} Formatted title
 */
export function formatBlogTitle(slug) {
  // Remove date prefix if present (YYYY-MM-DD-)
  const titlePart = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');

  // Split by hyphens, capitalize each word, and join
  return titlePart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formats a date string to a human-readable format
 * Example: "2024-01-15" -> "January 15, 2024"
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Sorts an array of blog posts by date in descending order (newest first)
 * @param {Array} posts - Array of blog post objects with date property
 * @returns {Array} Sorted array of posts
 */
export function sortByDateDesc(posts) {
  return [...posts].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
}
