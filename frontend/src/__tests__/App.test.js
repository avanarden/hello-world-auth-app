import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';

describe('App Routing', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders BlogList at root path', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { slug: '2024-01-15-test', title: 'Test Post', date: '2024-01-15', path: '/2024/blog.md' }
      ]
    });

    window.history.pushState({}, 'Test page', '/blog/');

    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Blog Posts')).toBeInTheDocument();
    });
  });

  test('renders BlogPost at /blog/:slug path', async () => {
    const mockIndex = [
      { slug: '2024-01-15-test', title: 'Test Post', date: '2024-01-15', path: '/2024/blog.md' }
    ];

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockIndex })
      .mockResolvedValueOnce({ ok: true, text: async () => '# Content' });

    window.history.pushState({}, 'Test page', '/blog/blog/2024-01-15-test');

    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
  });

  test('redirects /blog/index.html to root', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { slug: '2024-01-15-test', title: 'Test Post', date: '2024-01-15', path: '/2024/blog.md' }
      ]
    });

    window.history.pushState({}, 'Test page', '/blog/index.html');

    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Blog Posts')).toBeInTheDocument();
    });
  });

  test('renders NotFound for invalid routes', () => {
    window.history.pushState({}, 'Test page', '/blog/invalid-route');

    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  test('renders app header on all pages', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { slug: '2024-01-15-test', title: 'Test Post', date: '2024-01-15', path: '/2024/blog.md' }
      ]
    });

    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: "Alan's Blog", level: 1 })).toBeInTheDocument();
    });
  });
});
