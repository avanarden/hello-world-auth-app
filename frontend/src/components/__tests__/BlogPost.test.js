import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import BlogPost from '../BlogPost';

// Mock react-markdown
jest.mock('react-markdown', () => {
  return function ReactMarkdown({ children }) {
    return <div>{children}</div>;
  };
});

// Mock remark-gfm
jest.mock('remark-gfm', () => () => {});

// Mock react-syntax-highlighter
jest.mock('react-syntax-highlighter', () => ({
  Prism: function SyntaxHighlighter({ children }) {
    return <code>{children}</code>;
  }
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {}
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

const { useParams } = require('react-router-dom');

const renderWithProviders = (component) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('BlogPost', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('shows loading state initially', () => {
    useParams.mockReturnValue({ slug: '2024-01-15-test-post' });
    global.fetch.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<BlogPost />);
    expect(screen.getByText('Loading blog post...')).toBeInTheDocument();
  });

  test('renders blog post with markdown content', async () => {
    useParams.mockReturnValue({ slug: '2024-01-15-test-post' });

    const mockIndex = [
      {
        slug: '2024-01-15-test-post',
        title: 'Test Post',
        date: '2024-01-15',
        path: '/2024/blog-2024-01-15-test-post.md'
      }
    ];

    const mockMarkdown = '# Hello World\n\nThis is a test post.';

    global.fetch
      .mockResolvedValueOnce({ // First call: blog index
        ok: true,
        json: async () => mockIndex
      })
      .mockResolvedValueOnce({ // Second call: markdown file
        ok: true,
        text: async () => mockMarkdown
      });

    renderWithProviders(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });
  });

  test('shows error when post not found in index', async () => {
    useParams.mockReturnValue({ slug: 'non-existent-post' });

    const mockIndex = [
      { slug: '2024-01-15-different-post', title: 'Different Post', date: '2024-01-15', path: '/2024/blog.md' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockIndex
    });

    renderWithProviders(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText(/doesn't exist/)).toBeInTheDocument();
      expect(screen.getByText('Error Loading Post')).toBeInTheDocument();
    });
  });

  test('shows error when blog index fails to load', async () => {
    useParams.mockReturnValue({ slug: '2024-01-15-test-post' });

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    renderWithProviders(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to load blog index/)).toBeInTheDocument();
    });
  });

  test('shows error when markdown file not found (404)', async () => {
    useParams.mockReturnValue({ slug: '2024-01-15-test-post' });

    const mockIndex = [
      { slug: '2024-01-15-test-post', title: 'Test Post', date: '2024-01-15', path: '/2024/missing.md' }
    ];

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockIndex
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404
      });

    renderWithProviders(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText(/could not be found/)).toBeInTheDocument();
    });
  });

  test('renders back links to blog list', async () => {
    useParams.mockReturnValue({ slug: '2024-01-15-test-post' });

    const mockIndex = [
      { slug: '2024-01-15-test-post', title: 'Test Post', date: '2024-01-15', path: '/2024/blog.md' }
    ];

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockIndex })
      .mockResolvedValueOnce({ ok: true, text: async () => '# Test' });

    renderWithProviders(<BlogPost />);

    await waitFor(() => {
      const backLinks = screen.getAllByText('← Back to Blog List');
      expect(backLinks).toHaveLength(2); // One at top, one at bottom
      expect(backLinks[0].closest('a')).toHaveAttribute('href', '/');
    });
  });

  test('uses formatBlogTitle as fallback when title missing', async () => {
    useParams.mockReturnValue({ slug: '2024-01-15-fallback-test' });

    // Post info without title property
    const mockIndex = [
      { slug: '2024-01-15-fallback-test', date: '2024-01-15', path: '/2024/blog.md' }
    ];

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockIndex })
      .mockResolvedValueOnce({ ok: true, text: async () => '# Content' });

    renderWithProviders(<BlogPost />);

    await waitFor(() => {
      expect(screen.getByText('Fallback Test')).toBeInTheDocument(); // formatBlogTitle result
    });
  });
});
