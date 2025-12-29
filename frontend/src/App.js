import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Alan's Blog</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog/:slug" element={<BlogPostPlaceholder />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="empty-state">
      <p>No blog posts yet</p>
    </div>
  );
}

function BlogPostPlaceholder() {
  return (
    <div>
      <p>Blog post content will appear here</p>
    </div>
  );
}

export default App;
