import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import BlogList from '../BlogList';

const renderWithProviders = (component) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('BlogList', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('shows loading state initially', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithProviders(<BlogList />);
    expect(screen.getByText('Loading blog posts...')).toBeInTheDocument();
  });

  test('displays blog posts after successful fetch', async () => {
    const mockPosts = [
      { slug: '2024-01-15-first-post', title: 'First Post', date: '2024-01-15', path: '/2024/blog-2024-01-15-first-post.md' },
      { slug: '2024-06-10-second-post', title: 'Second Post', date: '2024-06-10', path: '/2024/blog-2024-06-10-second-post.md' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts
    });

    renderWithProviders(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });

  test('displays posts sorted by date (newest first)', async () => {
    const mockPosts = [
      { slug: '2024-01-15-old', title: 'Old Post', date: '2024-01-15', path: '/2024/blog-2024-01-15-old.md' },
      { slug: '2024-12-30-new', title: 'New Post', date: '2024-12-30', path: '/2024/blog-2024-12-30-new.md' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts
    });

    renderWithProviders(<BlogList />);

    await waitFor(() => {
      const titles = screen.getAllByRole('heading', { level: 3 });
      expect(titles[0]).toHaveTextContent('New Post');
      expect(titles[1]).toHaveTextContent('Old Post');
    });
  });

  test('shows error when blog index not found (404)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    renderWithProviders(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText(/Blog index not found/)).toBeInTheDocument();
    });
  });

  test('shows error when network fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText(/Error loading blog posts/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no posts', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderWithProviders(<BlogList />);

    await waitFor(() => {
      expect(screen.getByText('No blog posts yet')).toBeInTheDocument();
    });
  });

  test('renders correct links for each post', async () => {
    const mockPosts = [
      { slug: '2024-01-15-test', title: 'Test Post', date: '2024-01-15', path: '/2024/blog-2024-01-15-test.md' }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts
    });

    renderWithProviders(<BlogList />);

    await waitFor(() => {
      const link = screen.getByRole('link', { name: /Test Post/ });
      expect(link).toHaveAttribute('href', '/blog/2024-01-15-test');
    });
  });
});
