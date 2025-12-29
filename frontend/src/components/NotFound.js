import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function NotFound() {
  return (
    <div className="blog-post-error">
      <Helmet>
        <title>404 - Page Not Found - Alan's Blog</title>
        <meta name="description" content="The page you're looking for could not be found." />
      </Helmet>

      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="back-link">← Back to Blog List</Link>
    </div>
  );
}

export default NotFound;
