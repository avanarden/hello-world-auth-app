import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { formatDate, sortByDateDesc } from '../utils/blogUtils';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch blog index
    fetch(`${process.env.PUBLIC_URL}/blog-index.json`)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog index not found. Please contact the site administrator.');
          }
          throw new Error('Unable to load blog posts. Please check your connection and try again.');
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
      <Helmet>
        <title>Alan's Blog - Home</title>
        <meta name="description" content="Welcome to Alan's Blog. Read articles on software development, technology, and more." />
      </Helmet>

      <h2>Blog Posts</h2>
      <ul className="blog-list-items">
        {posts.map(post => (
          <li key={post.slug} className="blog-list-item">
            <Link to={`/blog/${post.slug}`} className="blog-list-link">
              <h3 className="blog-list-title">{post.title}</h3>
              <time className="blog-list-date">{formatDate(post.date)}</time>
              {post.summary && (
                <p className="blog-list-summary">{post.summary}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
