import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import NotFound from '../NotFound';

describe('NotFound', () => {
  test('renders 404 message', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  test('renders link back to home', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <NotFound />
        </BrowserRouter>
      </HelmetProvider>
    );

    const homeLink = screen.getByRole('link', { name: /back to blog list/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
