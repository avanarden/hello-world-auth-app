import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogList from './components/BlogList';
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
            <Route path="/" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPostPlaceholder />} />
          </Routes>
        </main>
      </div>
    </Router>
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
