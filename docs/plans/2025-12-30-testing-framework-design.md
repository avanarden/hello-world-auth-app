# Testing Framework Design

**Date:** 2025-12-30
**Goal:** Establish comprehensive test coverage for the blog application and implement TDD workflow for future development

---

## Overview

This design establishes a testing framework for the React blog application using Jest and React Testing Library. The approach is two-phased:

1. **Phase 1: Baseline Coverage** - Add tests to all existing code (utilities, components, routing)
2. **Phase 2: TDD Going Forward** - Use strict Test-Driven Development for all new features

**Why Jest + React Testing Library:**
- Already included with Create React App (zero setup needed)
- Industry standard with extensive documentation and ecosystem
- React Testing Library encourages testing user behavior, not implementation details
- Perfect for this use case: component rendering, user interactions, and routing

---

## Testing Strategy

### Coverage Priorities

1. **Utilities First** (easiest, immediate value)
   - Pure functions are simple to test
   - Builds confidence and establishes patterns
   - Target: 100% coverage

2. **Component Tests** (core value)
   - Test user-visible behavior
   - Focus on rendering, interactions, and state changes
   - Target: 80%+ coverage

3. **Integration Tests** (highest confidence)
   - Full routing flows
   - Navigation between pages
   - End-to-end user journeys
   - Target: All critical user flows covered

---

## Setup and Configuration

### Project Structure

```
frontend/src/
├── components/
│   ├── __tests__/
│   │   ├── BlogList.test.js
│   │   ├── BlogPost.test.js
│   │   └── NotFound.test.js
│   ├── BlogList.js
│   ├── BlogPost.js
│   └── NotFound.js
├── utils/
│   ├── __tests__/
│   │   └── blogUtils.test.js
│   └── blogUtils.js
└── __tests__/
    ├── App.test.js
    └── integration.test.js
```

### NPM Scripts

Add to `frontend/package.json`:

```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "test:watch": "react-scripts test --watch"
  }
}
```

### Coverage Targets

- **Utilities**: 100% (pure functions, straightforward)
- **Components**: 80%+ (user interactions and error states)
- **Integration**: Key user flows (list → post → back)

---

## Phase 1: Baseline Test Coverage

### 1. Utility Function Tests

**File:** `frontend/src/utils/__tests__/blogUtils.test.js`

**Functions to test:**
- `formatBlogTitle(slug)` - Converts slug to formatted title
- `formatDate(dateString)` - Formats ISO dates to readable format
- `sortByDateDesc(posts)` - Sorts posts by date (newest first)

**Test Cases:**

```javascript
import { formatBlogTitle, formatDate, sortByDateDesc } from '../blogUtils';

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

describe('formatDate', () => {
  test('formats ISO date correctly', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
  });

  test('handles different months', () => {
    expect(formatDate('2024-12-31')).toBe('December 31, 2024');
  });
});

describe('sortByDateDesc', () => {
  test('sorts posts newest first', () => {
    const posts = [
      { date: '2024-01-15', title: 'Old' },
      { date: '2024-12-30', title: 'New' },
      { date: '2024-06-10', title: 'Middle' }
    ];
    const sorted = sortByDateDesc(posts);
    expect(sorted[0].title).toBe('New');
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
});
```

---

### 2. BlogList Component Tests

**File:** `frontend/src/components/__tests__/BlogList.test.js`

**What to test:**
- Loading state
- Successful fetch and display of posts
- Posts sorted by date (newest first)
- Error handling (404, network errors)
- Empty state
- Correct links for each post

**Implementation:**

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import BlogList from '../BlogList';

// Test wrapper with required providers
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
```

---

### 3. BlogPost Component Tests

**File:** `frontend/src/components/__tests__/BlogPost.test.js`

**What to test:**
- Loading state
- Successful rendering with markdown content
- Post not found in index (404)
- Markdown file not found (404)
- Network errors
- Back links to blog list
- Fallback title formatting

**Implementation:**

```javascript
import { render, screen, waitFor } from '@testing-library/react';
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
```

---

### 4. Routing and Integration Tests

**File:** `frontend/src/__tests__/App.test.js`

**What to test:**
- BlogList renders at root path
- BlogPost renders at `/blog/:slug`
- `/blog/index.html` redirects to root
- NotFound renders for invalid routes
- App header appears on all pages

**Implementation:**

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

**File:** `frontend/src/components/__tests__/NotFound.test.js`

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

**File:** `frontend/src/__tests__/integration.test.js`

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

---

## Phase 2: TDD Workflow for Future Development

### The TDD Cycle (Red-Green-Refactor)

**1. RED - Write a failing test**

Write a test that describes the desired behavior before implementing it.

```javascript
// Example: Adding a new utility function
test('truncates long blog titles to 50 characters', () => {
  const longTitle = 'This Is A Very Long Blog Post Title That Should Be Truncated';
  expect(truncateTitle(longTitle, 50)).toBe('This Is A Very Long Blog Post Title That Shou...');
});
```

Run test → ❌ Fails (function doesn't exist yet)

**2. GREEN - Write minimal code to pass**

Implement just enough code to make the test pass.

```javascript
export function truncateTitle(title, maxLength) {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
}
```

Run test → ✅ Passes

**3. REFACTOR - Improve code quality**

Clean up the code while keeping tests green.

```javascript
export function truncateTitle(title, maxLength = 60) {
  if (!title || title.length <= maxLength) return title;
  return title.substring(0, maxLength).trim() + '...';
}
```

Run test → ✅ Still passes (add more tests if needed)

---

### TDD Workflow Examples

#### Example 1: Adding Search Filter to BlogList

**Step 1: Write the test FIRST**

```javascript
// utils/__tests__/blogUtils.test.js
test('filters blog posts by search term', () => {
  const posts = [
    { title: 'React Testing Guide', slug: '2024-01-15-react-testing' },
    { title: 'Python Basics', slug: '2024-02-10-python-basics' }
  ];

  expect(filterPosts(posts, 'react')).toHaveLength(1);
  expect(filterPosts(posts, 'react')[0].title).toBe('React Testing Guide');
});
```

**Step 2: Implement the function**

```javascript
// utils/blogUtils.js
export function filterPosts(posts, searchTerm) {
  if (!searchTerm) return posts;
  return posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
```

**Step 3: Test UI integration**

```javascript
// components/__tests__/BlogList.test.js
test('filters posts when user types in search box', async () => {
  const user = userEvent.setup();
  // ... render component with mock data

  const searchInput = screen.getByPlaceholderText('Search posts...');
  await user.type(searchInput, 'react');

  expect(screen.getByText('React Testing Guide')).toBeInTheDocument();
  expect(screen.queryByText('Python Basics')).not.toBeInTheDocument();
});
```

#### Example 2: Adding Reading Time Estimate

**Step 1: Test first (utility function)**

```javascript
test('calculates reading time for blog post', () => {
  const shortPost = 'This is a short post with about 10 words in it.';
  const longPost = 'word '.repeat(600); // ~600 words

  expect(calculateReadingTime(shortPost)).toBe(1); // min 1 minute
  expect(calculateReadingTime(longPost)).toBe(3); // 600 words / 200 wpm ≈ 3 min
});
```

**Step 2: Implement**

```javascript
export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}
```

**Step 3: Test component integration**

```javascript
test('displays reading time on blog post', async () => {
  // ... setup mocks with content

  await waitFor(() => {
    expect(screen.getByText(/3 min read/i)).toBeInTheDocument();
  });
});
```

---

### Daily TDD Workflow

**Morning setup:**
```bash
cd frontend
npm run test:watch  # Runs tests in watch mode
```

**For each new feature/fix:**
1. Create test file (or add to existing)
2. Write failing test describing desired behavior
3. Run tests → verify it fails (RED)
4. Write minimal implementation
5. Run tests → verify it passes (GREEN)
6. Refactor if needed (REFACTOR)
7. Commit with passing tests

**Before committing:**
```bash
npm run test:coverage  # Check coverage hasn't dropped
```

---

### Test Organization Best Practices

#### 1. One test file per source file

```
utils/
  blogUtils.js
  __tests__/
    blogUtils.test.js
```

#### 2. Group related tests with describe blocks

```javascript
describe('formatBlogTitle', () => {
  describe('with date prefix', () => {
    test('removes YYYY-MM-DD prefix', () => { ... });
  });

  describe('without date prefix', () => {
    test('capitalizes words', () => { ... });
  });
});
```

#### 3. Clear test names (what, when, expected)

```javascript
// ✅ Good
test('returns empty array when no posts match search term', () => {});

// ❌ Bad
test('search works', () => {});
```

#### 4. AAA Pattern (Arrange, Act, Assert)

```javascript
test('sorts posts by date descending', () => {
  // Arrange - set up test data
  const posts = [
    { date: '2024-01-15' },
    { date: '2024-12-30' }
  ];

  // Act - execute the function
  const sorted = sortByDateDesc(posts);

  // Assert - verify the result
  expect(sorted[0].date).toBe('2024-12-30');
});
```

---

### Coverage Goals and Commands

**Check coverage:**
```bash
cd frontend
npm run test:coverage
```

**Coverage Targets:**
- **Utilities**: 100% (pure functions, easy to test)
- **Components**: 80%+ (focus on user interactions)
- **Integration**: Key user flows covered

**Don't chase 100% coverage everywhere.** Focus on:
- Critical business logic
- Bug-prone areas
- User-facing features
- Edge cases that have caused issues

---

### Common TDD Pitfalls to Avoid

1. ❌ **Writing tests after implementation** - defeats the purpose of TDD
2. ❌ **Testing implementation details** - test behavior, not internals
3. ❌ **Large, complex tests** - keep them focused and simple
4. ❌ **Not running tests frequently** - use watch mode during development
5. ❌ **Skipping refactor step** - clean code matters
6. ❌ **Mocking too much** - prefer integration tests when possible
7. ❌ **Weak test assertions** - be specific about expected outcomes

---

## Success Criteria

### Phase 1 Complete When:
- ✅ All utility functions have 100% test coverage
- ✅ All components have 80%+ test coverage
- ✅ All routing scenarios are tested
- ✅ Integration test covers main user flow (list → post → back)
- ✅ All tests pass in CI/CD pipeline
- ✅ Coverage report is generated and reviewed

### Phase 2 Complete When:
- ✅ Team consistently writes tests before implementation
- ✅ No new code is committed without tests
- ✅ Coverage remains stable or increases over time
- ✅ Bugs are caught by tests before reaching production

---

## Testing Commands Reference

```bash
# Run tests in watch mode (use during development)
cd frontend && npm run test:watch

# Run all tests once
cd frontend && npm test -- --watchAll=false

# Run tests with coverage report
cd frontend && npm run test:coverage

# Run specific test file
cd frontend && npm test -- BlogList.test.js

# Run tests matching a pattern
cd frontend && npm test -- --testNamePattern="BlogList"
```

---

## Next Steps

1. **Implement Phase 1**: Add all baseline tests
   - Start with utilities (easiest)
   - Move to components
   - Finish with integration tests

2. **Verify Coverage**: Run coverage report and ensure targets are met

3. **Establish TDD Workflow**: Begin using TDD for all new features

4. **Document Learnings**: Update this document with team-specific patterns and conventions

---

## Additional Resources

- [React Testing Library Documentation](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [TDD Fundamentals](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
