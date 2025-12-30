# Testing Framework Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish comprehensive test coverage for the blog application using Jest and React Testing Library with TDD workflow

**Architecture:** Jest + React Testing Library (already included with CRA), organized tests in `__tests__/` directories alongside source files, mock fetch API and React Router for component tests

**Tech Stack:** Jest, React Testing Library, @testing-library/user-event, react-router-dom, react-helmet-async

---

## Task 1: Test Infrastructure Setup

**Files:**
- Modify: `frontend/package.json`

**Step 1: Add test scripts to package.json**

Add these scripts to `frontend/package.json`:

```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:watch": "react-scripts test --watch"
  }
}
```

**Step 2: Verify test infrastructure**

Run: `cd frontend && npm test -- --version`
Expected: Jest version information displayed

**Step 3: Create test directory structure**

Run:
```bash
mkdir -p frontend/src/utils/__tests__
mkdir -p frontend/src/components/__tests__
mkdir -p frontend/src/__tests__
```

**Step 4: Commit**

```bash
git add frontend/package.json
git commit -m "test: add test scripts and directory structure"
```

---

## Task 2: blogUtils.test.js - formatBlogTitle Tests

**Files:**
- Create: `frontend/src/utils/__tests__/blogUtils.test.js`
- Test: `frontend/src/utils/blogUtils.js`

**Step 1: Write failing tests for formatBlogTitle**

Create `frontend/src/utils/__tests__/blogUtils.test.js`:

```javascript
import { formatBlogTitle } from '../blogUtils';

describe('formatBlogTitle', () => {
  test('removes date prefix and formats title', () => {
    expect(formatBlogTitle('2024-01-15-my-first-post')).toBe('My First Post');
  });

  test('formats slug without date prefix', () => {
    expect(formatBlogTitle('hello-world')).toBe('Hello World');
  });

  test('handles single word', () => {
    expect(formatBlogTitle('introduction')).toBe('Introduction');
  });

  test('handles multiple hyphens', () => {
    expect(formatBlogTitle('this-is-a-long-title')).toBe('This Is A Long Title');
  });
});
```

**Step 2: Run tests to verify they pass**

Run: `cd frontend && npm test -- blogUtils.test.js --watchAll=false`
Expected: All 4 tests PASS (function already exists)

**Step 3: Commit**

```bash
git add frontend/src/utils/__tests__/blogUtils.test.js
git commit -m "test: add formatBlogTitle test suite"
```

---

## Task 3: blogUtils.test.js - formatDate Tests

**Files:**
- Modify: `frontend/src/utils/__tests__/blogUtils.test.js`

**Step 1: Add formatDate tests**

Add to `frontend/src/utils/__tests__/blogUtils.test.js`:

```javascript
import { formatBlogTitle, formatDate } from '../blogUtils';

// ... existing formatBlogTitle tests ...

describe('formatDate', () => {
  test('formats ISO date correctly', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
  });

  test('handles different months', () => {
    expect(formatDate('2024-12-31')).toBe('December 31, 2024');
  });

  test('formats date at start of year', () => {
    expect(formatDate('2024-01-01')).toBe('January 1, 2024');
  });
});
```

**Step 2: Run tests to verify they pass**

Run: `cd frontend && npm test -- blogUtils.test.js --watchAll=false`
Expected: All formatDate tests PASS

**Step 3: Commit**

```bash
git add frontend/src/utils/__tests__/blogUtils.test.js
git commit -m "test: add formatDate test suite"
```

---

## Task 4: blogUtils.test.js - sortByDateDesc Tests

**Files:**
- Modify: `frontend/src/utils/__tests__/blogUtils.test.js`

**Step 1: Add sortByDateDesc tests**

Add to `frontend/src/utils/__tests__/blogUtils.test.js`:

```javascript
import { formatBlogTitle, formatDate, sortByDateDesc } from '../blogUtils';

// ... existing tests ...

describe('sortByDateDesc', () => {
  test('sorts posts newest first', () => {
    const posts = [
      { date: '2024-01-15', title: 'Old' },
      { date: '2024-12-30', title: 'New' },
      { date: '2024-06-10', title: 'Middle' }
    ];
    const sorted = sortByDateDesc(posts);
    expect(sorted[0].title).toBe('New');
    expect(sorted[1].title).toBe('Middle');
    expect(sorted[2].title).toBe('Old');
  });

  test('does not mutate original array', () => {
    const posts = [{ date: '2024-01-01' }, { date: '2024-12-01' }];
    const original = [...posts];
    sortByDateDesc(posts);
    expect(posts).toEqual(original);
  });

  test('handles empty array', () => {
    expect(sortByDateDesc([])).toEqual([]);
  });

  test('handles single post', () => {
    const posts = [{ date: '2024-01-15', title: 'Only' }];
    const sorted = sortByDateDesc(posts);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].title).toBe('Only');
  });
});
```

**Step 2: Run tests to verify they pass**

Run: `cd frontend && npm test -- blogUtils.test.js --watchAll=false`
Expected: All sortByDateDesc tests PASS

**Step 3: Verify 100% coverage for utilities**

Run: `cd frontend && npm test -- blogUtils.test.js --coverage --watchAll=false`
Expected: 100% coverage for blogUtils.js

**Step 4: Commit**

```bash
git add frontend/src/utils/__tests__/blogUtils.test.js
git commit -m "test: add sortByDateDesc test suite with 100% util coverage"
```

---

## Task 5: BlogList.test.js - Setup and Loading State

**Files:**
- Create: `frontend/src/components/__tests__/BlogList.test.js`

**Step 1: Write test for loading state**

Create `frontend/src/components/__tests__/BlogList.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
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
});
```

**Step 2: Run test to verify it passes**

Run: `cd frontend && npm test -- BlogList.test.js --watchAll=false`
Expected: Test PASSES

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/BlogList.test.js
git commit -m "test: add BlogList loading state test"
```

---

## Task 6: BlogList.test.js - Successful Fetch and Display

**Files:**
- Modify: `frontend/src/components/__tests__/BlogList.test.js`

**Step 1: Add test for successful post display**

Add to `frontend/src/components/__tests__/BlogList.test.js`:

```javascript
import { render, screen, waitFor } from '@testing-library/react';

// ... existing setup ...

describe('BlogList', () => {
  // ... existing tests ...

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
});
```

**Step 2: Run test to verify it passes**

Run: `cd frontend && npm test -- BlogList.test.js --watchAll=false`
Expected: Test PASSES

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/BlogList.test.js
git commit -m "test: add BlogList successful fetch test"
```

---

## Task 7: BlogList.test.js - Sorting Verification

**Files:**
- Modify: `frontend/src/components/__tests__/BlogList.test.js`

**Step 1: Add test for date sorting**

Add to `frontend/src/components/__tests__/BlogList.test.js`:

```javascript
describe('BlogList', () => {
  // ... existing tests ...

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
});
```

**Step 2: Run test to verify it passes**

Run: `cd frontend && npm test -- BlogList.test.js --watchAll=false`
Expected: Test PASSES

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/BlogList.test.js
git commit -m "test: add BlogList sorting verification test"
```

---

## Task 8: BlogList.test.js - Error States

**Files:**
- Modify: `frontend/src/components/__tests__/BlogList.test.js`

**Step 1: Add error state tests**

Add to `frontend/src/components/__tests__/BlogList.test.js`:

```javascript
describe('BlogList', () => {
  // ... existing tests ...

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
});
```

**Step 2: Run tests to verify they pass**

Run: `cd frontend && npm test -- BlogList.test.js --watchAll=false`
Expected: All error state tests PASS

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/BlogList.test.js
git commit -m "test: add BlogList error handling tests"
```

---

## Task 9: BlogList.test.js - Link Verification

**Files:**
- Modify: `frontend/src/components/__tests__/BlogList.test.js`

**Step 1: Add link verification test**

Add to `frontend/src/components/__tests__/BlogList.test.js`:

```javascript
describe('BlogList', () => {
  // ... existing tests ...

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
```

**Step 2: Run test to verify it passes**

Run: `cd frontend && npm test -- BlogList.test.js --watchAll=false`
Expected: Test PASSES

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/BlogList.test.js
git commit -m "test: add BlogList link verification test"
```

---

## Task 10: BlogPost.test.js - Setup and Loading State

**Files:**
- Create: `frontend/src/components/__tests__/BlogPost.test.js`

**Step 1: Write initial BlogPost tests**

Create `frontend/src/components/__tests__/BlogPost.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import BlogPost from '../BlogPost';

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
});
```

**Step 2: Run test to verify it passes**

Run: `cd frontend && npm test -- BlogPost.test.js --watchAll=false`
Expected: Test PASSES

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/BlogPost.test.js
git commit -m "test: add BlogPost loading state test"
```

---

## Task 11: BlogPost.test.js - Successful Rendering

**Files:**
- Modify: `frontend/src/components/__tests__/BlogPost.test.js`

**Step 1: Add successful rendering test**

Add to `frontend/src/components/__tests__/BlogPost.test.js`:

```javascript
import { render, screen, waitFor } from '@testing-library/react';

// ... existing setup ...

describe('BlogPost', () => {
  // ... existing tests ...

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
});
```

**Step 2: Run test to verify it passes**

Run: `cd frontend && npm test -- BlogPost.test.js --watchAll=false`
Expected: Test PASSES

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/BlogPost.test.js
git commit -m "test: add BlogPost successful rendering test"
```

---

## Task 12: BlogPost.test.js - Error States

**Files:**
- Modify: `frontend/src/components/__tests__/BlogPost.test.js`

**Step 1: Add error state tests**

Add to `frontend/src/components/__tests__/BlogPost.test.js`:

```javascript
describe('BlogPost', () => {
  // ... existing tests ...

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
});
```

**Step 2: Run tests to verify they pass**

Run: `cd frontend && npm test -- BlogPost.test.js --watchAll=false`
Expected: All error state tests PASS

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/BlogPost.test.js
git commit -m "test: add BlogPost error handling tests"
```

---

## Task 13: BlogPost.test.js - Navigation and Fallback

**Files:**
- Modify: `frontend/src/components/__tests__/BlogPost.test.js`

**Step 1: Add navigation and fallback tests**

Add to `frontend/src/components/__tests__/BlogPost.test.js`:

```javascript
describe('BlogPost', () => {
  // ... existing tests ...

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
```

**Step 2: Run tests to verify they pass**

Run: `cd frontend && npm test -- BlogPost.test.js --watchAll=false`
Expected: All tests PASS

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/BlogPost.test.js
git commit -m "test: add BlogPost navigation and fallback tests"
```

---

## Task 14: NotFound.test.js - Complete Component Test

**Files:**
- Create: `frontend/src/components/__tests__/NotFound.test.js`

**Step 1: Write NotFound component tests**

Create `frontend/src/components/__tests__/NotFound.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../NotFound';

describe('NotFound', () => {
  test('renders 404 message', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  test('renders link back to home', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
```

**Step 2: Run tests to verify they pass**

Run: `cd frontend && npm test -- NotFound.test.js --watchAll=false`
Expected: All tests PASS

**Step 3: Commit**

```bash
git add frontend/src/components/__tests__/NotFound.test.js
git commit -m "test: add NotFound component tests"
```

---

## Task 15: App.test.js - Routing Tests

**Files:**
- Create: `frontend/src/__tests__/App.test.js`

**Step 1: Write routing tests**

Create `frontend/src/__tests__/App.test.js`:

```javascript
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
      json: async () => []
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
      json: async () => []
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
      json: async () => []
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
```

**Step 2: Run tests to verify they pass**

Run: `cd frontend && npm test -- App.test.js --watchAll=false`
Expected: All routing tests PASS

**Step 3: Commit**

```bash
git add frontend/src/__tests__/App.test.js
git commit -m "test: add App routing tests"
```

---

## Task 16: Integration Test - Full User Flow

**Files:**
- Create: `frontend/src/__tests__/integration.test.js`

**Step 1: Install user-event dependency**

Run: `cd frontend && npm install --save-dev @testing-library/user-event`

**Step 2: Write integration test**

Create `frontend/src/__tests__/integration.test.js`:

```javascript
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
```

**Step 3: Run test to verify it passes**

Run: `cd frontend && npm test -- integration.test.js --watchAll=false`
Expected: Integration test PASSES

**Step 4: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/__tests__/integration.test.js
git commit -m "test: add full user flow integration test"
```

---

## Task 17: Coverage Verification

**Files:**
- Review: All test files

**Step 1: Run full test suite**

Run: `cd frontend && npm test -- --watchAll=false --passWithNoTests=false`
Expected: All tests PASS

**Step 2: Generate coverage report**

Run: `cd frontend && npm run test:coverage`
Expected Output:
```
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   80+   |   70+    |   80+   |   80+   |
 utils/blogUtils.js |   100   |   100    |   100   |   100   |
 components/        |   80+   |   70+    |   80+   |   80+   |
```

**Step 3: Review coverage gaps**

Check coverage report in `frontend/coverage/lcov-report/index.html`
Note any uncovered lines

**Step 4: Document coverage results**

Create note of baseline coverage numbers

**Step 5: Commit coverage configuration**

```bash
git add .
git commit -m "test: verify baseline coverage (utilities 100%, components 80+%)"
```

---

## Task 18: CI/CD Integration (Optional)

**Files:**
- Create: `.github/workflows/test.yml` (if using GitHub Actions)

**Step 1: Add GitHub Actions workflow (if applicable)**

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: |
        cd frontend
        npm ci

    - name: Run tests
      run: |
        cd frontend
        npm run test:coverage

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        directory: ./frontend/coverage
```

**Step 2: Commit CI/CD configuration**

```bash
git add .github/workflows/test.yml
git commit -m "ci: add test workflow for GitHub Actions"
```

**Note:** Skip this task if not using GitHub Actions or if CI/CD setup is handled separately.

---

## Task 19: Documentation Update

**Files:**
- Modify: `README.md`

**Step 1: Add testing section to README**

Add to `README.md` after the "Available Scripts" section:

```markdown
## Testing

This project uses Jest and React Testing Library for comprehensive test coverage.

### Running Tests

From the root directory:

```bash
# Run tests in watch mode (recommended during development)
npm test

# Run all tests once
cd frontend && npm test -- --watchAll=false

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are organized alongside source files in `__tests__/` directories:

```
frontend/src/
├── utils/__tests__/blogUtils.test.js
├── components/__tests__/
│   ├── BlogList.test.js
│   ├── BlogPost.test.js
│   └── NotFound.test.js
└── __tests__/
    ├── App.test.js
    └── integration.test.js
```

### Coverage Goals

- **Utilities**: 100% coverage (pure functions)
- **Components**: 80%+ coverage (user interactions)
- **Integration**: Key user flows covered

### TDD Workflow

For new features, follow Test-Driven Development:

1. Write failing test describing desired behavior
2. Run test to verify it fails
3. Implement minimal code to pass test
4. Run test to verify it passes
5. Refactor and commit

See `docs/plans/2025-12-30-testing-framework-design.md` for comprehensive testing guidelines.
```

**Step 2: Commit README update**

```bash
git add README.md
git commit -m "docs: add testing section to README"
```

---

## Task 20: Final Verification and Cleanup

**Files:**
- Review: All test files and implementation

**Step 1: Run complete test suite**

Run: `cd frontend && npm test -- --watchAll=false`
Expected: All tests PASS, no warnings

**Step 2: Verify all test files are committed**

Run: `git status`
Expected: Working tree clean

**Step 3: Review coverage one final time**

Run: `cd frontend && npm run test:coverage`
Expected: Meet or exceed coverage targets

**Step 4: Create summary commit**

```bash
git add .
git commit -m "test: complete baseline test coverage implementation

- 100% utility function coverage (blogUtils.js)
- 80%+ component coverage (BlogList, BlogPost, NotFound)
- App routing tests for all routes
- Full user flow integration test
- CI/CD integration ready
- Updated documentation

Phase 1 complete. Ready for TDD workflow in Phase 2."
```

---

## Success Criteria

- ✅ All test files created and passing
- ✅ Utilities: 100% coverage
- ✅ Components: 80%+ coverage
- ✅ Integration test covers main user flow
- ✅ CI/CD integration (if applicable)
- ✅ Documentation updated
- ✅ No failing tests
- ✅ No console warnings during test runs

---

## Post-Implementation: TDD Workflow

After completing this plan, use strict TDD for all new features:

1. **For each new feature:**
   - Write failing test first
   - Implement minimal code
   - Refactor
   - Commit with tests

2. **Daily workflow:**
   - Start with `npm run test:watch`
   - Keep tests green
   - Commit frequently

3. **Before merging:**
   - Run `npm run test:coverage`
   - Verify coverage hasn't decreased
   - All tests pass

See `docs/plans/2025-12-30-testing-framework-design.md` for detailed TDD examples and patterns.
