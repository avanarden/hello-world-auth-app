import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import NotFound from './components/NotFound';
import './App.css';

function App() {
  return (
    <Router basename="/blog">
      <div className="app">
        <header className="app-header">
          <h1>Alan's Blog</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
