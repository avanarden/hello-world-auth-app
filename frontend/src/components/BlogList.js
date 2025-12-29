import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, sortByDateDesc } from '../utils/blogUtils';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch blog index
    fetch('/blog-index.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load blog posts');
        }
        return response.json();
      })
      .then(data => {
        // Sort posts by date (newest first)
        const sortedPosts = sortByDateDesc(data);
        setPosts(sortedPosts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blog index:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="blog-list-loading">
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list-error">
        <p>Error loading blog posts: {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>No blog posts yet</p>
      </div>
    );
  }

  return (
    <div className="blog-list">
      <h2>Blog Posts</h2>
      <ul className="blog-list-items">
        {posts.map(post => (
          <li key={post.slug} className="blog-list-item">
            <Link to={`/blog/${post.slug}`} className="blog-list-link">
              <h3 className="blog-list-title">{post.title}</h3>
              <time className="blog-list-date">{formatDate(post.date)}</time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
