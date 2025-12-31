import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';

describe('Integration: Full User Flow', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    window.history.pushState({}, 'Test page', '/blog/');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('user can navigate from blog list to post and back', async () => {
    const user = userEvent.setup();

    const mockIndex = [
      { slug: '2024-01-15-test', title: 'Test Post', date: '2024-01-15', path: '/2024/blog.md' }
    ];
    const mockMarkdown = '# Test Content\n\nThis is a test.';

    // Mock for blog list
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockIndex
    });

    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );

    // Wait for blog list to load
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });

    // Mock for blog post (index + markdown)
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockIndex })
      .mockResolvedValueOnce({ ok: true, text: async () => mockMarkdown });

    // Click on blog post link
    const postLink = screen.getByRole('link', { name: /Test Post/i });
    await user.click(postLink);

    // Wait for blog post to load
    await waitFor(() => {
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });

    // Mock for returning to blog list
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockIndex
    });

    // Click back link
    const backLink = screen.getAllByText('← Back to Blog List')[0];
    await user.click(backLink);

    // Wait for blog list to load again
    await waitFor(() => {
      expect(screen.getByText('Blog Posts')).toBeInTheDocument();
    });
  });
});
