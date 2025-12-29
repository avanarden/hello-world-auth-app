import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
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
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
