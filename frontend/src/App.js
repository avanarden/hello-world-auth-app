import React, { useState, useEffect } from 'react';

function App() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [token, setToken] = useState('');

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
        setMessage('');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login error occurred');
    }
    
    setLoginLoading(false);
  };

  // Handle logout
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setMessage('');
    setText('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    fetch('http://localhost:3001/api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    })
      .then(response => {
        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid
          handleLogout();
          return;
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setMessage(data.message || data.error);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Error sending message');
        setLoading(false);
      });
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Login Required</h2>
        <form onSubmit={handleLogin} style={{ marginTop: '30px' }}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{ padding: '10px', fontSize: '16px', width: '200px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ padding: '10px', fontSize: '16px', width: '200px' }}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loginLoading}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && (
          <p style={{ marginTop: '20px', color: 'red' }}>
            {message}
          </p>
        )}
        <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
          <p>Test credentials:</p>
          <p>Username: <strong>admin</strong></p>
          <p>Password: <strong>password123</strong></p>
        </div>
      </div>
    );
  }

  // Main app (authenticated)
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{ padding: '5px 10px', fontSize: '14px' }}
        >
          Logout
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your message"
          style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
      {message && (
        <h1 style={{ marginTop: '30px' }}>
          {message}
        </h1>
      )}
    </div>
  );
}

export default App;