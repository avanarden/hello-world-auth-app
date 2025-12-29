import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatBlogTitle, formatDate } from '../utils/blogUtils';

function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postInfo, setPostInfo] = useState(null);

  useEffect(() => {
    // Fetch blog index to get post info
    fetch('/blog-index.json')
      .then(response => response.json())
      .then(posts => {
        const post = posts.find(p => p.slug === slug);
        if (!post) {
          throw new Error('Blog post not found');
        }
        setPostInfo(post);
        return fetch(post.path);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load blog post content');
        }
        return response.text();
      })
      .then(markdown => {
        setContent(markdown);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blog post:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-post-loading">
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-post-error">
        <h2>Error Loading Post</h2>
        <p>{error}</p>
        <Link to="/" className="back-link">← Back to Blog List</Link>
      </div>
    );
  }

  return (
    <article className="blog-post">
      <div className="blog-post-header">
        <h1 className="blog-post-title">{postInfo?.title || formatBlogTitle(slug)}</h1>
        {postInfo?.date && (
          <time className="blog-post-date">{formatDate(postInfo.date)}</time>
        )}
      </div>

      <Link to="/" className="back-link">← Back to Blog List</Link>

      <div className="blog-post-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <div className="blog-post-footer">
        <Link to="/" className="back-link">← Back to Blog List</Link>
      </div>
    </article>
  );
}

export default BlogPost;
