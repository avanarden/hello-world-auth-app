# Alan's Blog

A static blog site built with React, featuring markdown blog posts with syntax highlighting and GitHub-flavored markdown support. Designed to be deployed to Amazon S3 as a static website.

## Features

- Clean, minimal blog design focused on readability
- Markdown blog posts with GitHub-flavored markdown (GFM) support
  - Tables
  - Task lists
  - Syntax highlighting for code blocks
  - Blockquotes, links, and all standard markdown features
- Client-side routing with React Router
- SEO-friendly with dynamic meta tags for each post
- Responsive design for mobile and desktop
- Simple JSON-based blog index for easy content management

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router DOM
- **Markdown Rendering**: react-markdown with remark-gfm
- **Syntax Highlighting**: react-syntax-highlighter
- **SEO**: react-helmet-async
- **Deployment**: Amazon S3 Static Website Hosting

## Local Development Setup

### Prerequisites

- Node.js 18 or later
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd basic-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The blog will be available at `http://localhost:3000`.

### Available Scripts

From the root directory:

- `npm start` - Start the development server
- `npm run build` - Build the production bundle (automatically generates blog index)
- `npm run generate-index` - Generate blog index from markdown files
- `npm install` - Install dependencies

From the `frontend/` directory:

- `npm start` - Start the development server
- `npm run build` - Create production build in `frontend/build/`
- `npm test` - Run tests (if configured)

## Testing

This project uses Jest and React Testing Library for comprehensive test coverage across both frontend components and build scripts.

### Running Tests

From the root directory:

```bash
# Run all tests (frontend + scripts)
npm test

# Run only frontend tests
npm run test:frontend

# Run only scripts tests
npm run test:scripts

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

scripts/
└── __tests__/
    └── generate-blog-index.test.js
```

### Coverage Goals

- **Utilities & Pure Functions**: 100% coverage
- **Frontend Components**: 80%+ coverage (user interactions)
- **Build Scripts**: 90%+ coverage (I/O operations)
- **Integration Tests**: Key user flows covered

### Test Types

**Frontend Tests:**
- Component unit tests (React Testing Library)
- Integration tests (user flows)
- Utility function tests

**Build Script Tests:**
- Unit tests for pure functions (formatTitle)
- Integration tests with real filesystem operations
- Temporary directories for test isolation

### TDD Workflow

For new features, follow Test-Driven Development:

1. Write failing test describing desired behavior
2. Run test to verify it fails
3. Implement minimal code to pass test
4. Run test to verify it passes
5. Refactor and commit

See `docs/plans/2025-12-30-testing-framework-design.md` for comprehensive testing guidelines.

## Adding New Blog Posts

The blog uses an automated index generation system that discovers blog posts from markdown files.

### Step 1: Create the Markdown File

Create a new markdown file in the appropriate year directory under `frontend/public/`:

```bash
# Example for a post on March 15, 2025
# Create the year directory if it doesn't exist
mkdir -p frontend/public/2025

# Create your blog post file
touch frontend/public/2025/blog-2025-03-15-my-new-post.md
```

**IMPORTANT - File Naming Convention**: `blog-YYYY-MM-DD-title-slug.md`

- **Year directory**: Files must be in a `YYYY/` directory (e.g., `2025/`)
- **Filename format**: Must start with `blog-` followed by date `YYYY-MM-DD-` and a title slug
- **Year consistency**: The year in the directory must match the year in the filename
- **Title slug**: Use lowercase with hyphens (e.g., `my-new-post`)

**Examples:**
- ✅ `2025/blog-2025-03-15-my-new-post.md` (correct)
- ✅ `2024/blog-2024-12-01-another-post.md` (correct)
- ❌ `2025/blog-2024-03-15-my-post.md` (year mismatch)
- ❌ `2025/2025-03-15-my-post.md` (missing `blog-` prefix)
- ❌ `blog-2025-03-15-my-post.md` (missing year directory)

### Step 2: Write Your Content

Open the markdown file and write your blog post using GitHub-flavored markdown:

```markdown
# My Blog Post Title

This is the introduction paragraph.

## Section Heading

You can use all standard markdown features:

- Lists
- **Bold text**
- *Italic text*
- [Links](https://example.com)

### Code Examples

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Tables

| Feature | Supported |
|---------|-----------|
| Tables  | Yes       |
| Lists   | Yes       |

### Task Lists

- [x] Completed task
- [ ] Pending task
```

### Step 3: Generate the Blog Index

The blog index is generated automatically, but you have two options:

**Option A: Quick Development Testing**

Generate the index without doing a full build:

```bash
npm run generate-index
```

This scans all year directories, discovers blog posts, and updates `frontend/public/blog-index.json`. Use this when you want to quickly test your new post locally.

**Option B: Production Build** (Recommended)

The index is automatically generated when you build:

```bash
npm run build
```

This runs the index generation automatically before building the React app, ensuring your production deployment always has an up-to-date index.

### Step 4: Test Locally

```bash
npm start
```

Navigate to `http://localhost:3000` and verify:
- Your new post appears in the blog list
- Clicking the post loads and renders the markdown correctly
- All formatting, code blocks, and links work as expected
- Posts are sorted by date (newest first)

### Step 5: Deploy

See the deployment section below.

## Deployment to Amazon S3

This blog is designed to be deployed as a static website on Amazon S3.

### Quick Deployment Guide

1. **Build the production bundle**:
   ```bash
   npm run build
   ```

2. **Create an S3 bucket** (if not already created):
   - Bucket name should match your desired domain (optional)
   - Enable static website hosting
   - Configure bucket policy for public read access

3. **Upload to S3**:
   ```bash
   aws s3 sync frontend/build/ s3://YOUR-BUCKET-NAME/ --acl public-read
   ```

4. **Access your blog**:
   ```
   http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com
   ```

### Detailed Deployment Instructions

For comprehensive deployment instructions, including:
- S3 bucket structure and file organization
- Static website hosting configuration
- CORS settings (if needed)
- Bucket policies and permissions
- CI/CD pipeline examples
- Custom domain setup
- Troubleshooting

See the complete guide: [docs/specs/01-spec-static-blog-site/s3-bucket-structure-example.md](docs/specs/01-spec-static-blog-site/s3-bucket-structure-example.md)

## Project Structure

```
basic-app/
├── frontend/
│   ├── public/
│   │   ├── blog-index.json        # Blog metadata index
│   │   ├── index.html             # HTML template
│   │   └── 2024/                  # Blog posts organized by year
│   │       ├── blog-2024-01-15-sample-post.md
│   │       ├── blog-2024-03-20-another-post.md
│   │       └── blog-2024-06-10-third-post.md
│   ├── src/
│   │   ├── components/
│   │   │   ├── BlogList.js        # Blog post listing page
│   │   │   ├── BlogPost.js        # Individual blog post page
│   │   │   └── NotFound.js        # 404 error page
│   │   ├── utils/
│   │   │   └── blogUtils.js       # Utility functions
│   │   ├── App.js                 # Main app component with routing
│   │   ├── App.css                # Global styles
│   │   └── index.js               # React entry point
│   └── package.json
├── docs/
│   └── specs/
│       └── 01-spec-static-blog-site/
│           ├── 01-spec-static-blog-site.md
│           ├── 01-tasks-static-blog-site.md
│           └── s3-bucket-structure-example.md
├── package.json
└── README.md
```

## Content Guidelines

### Blog Post Best Practices

- Use descriptive, SEO-friendly titles
- Include code examples with language-specific syntax highlighting
- Break up long posts with headings (H2, H3)
- Use tables for structured data comparisons
- Add task lists for step-by-step guides
- Keep paragraphs concise for readability

### Supported Markdown Features

- **Headings**: H1-H6
- **Text formatting**: Bold, italic, strikethrough
- **Lists**: Ordered, unordered, task lists
- **Links**: Inline and reference-style
- **Images**: `![alt text](image-url)`
- **Code blocks**: Fenced code blocks with syntax highlighting
- **Inline code**: `code`
- **Tables**: GitHub-flavored markdown tables
- **Blockquotes**: Standard markdown blockquotes
- **Horizontal rules**: `---` or `***`

### Syntax Highlighting

Supported languages for code blocks (partial list):
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- Bash/Shell
- HTML/CSS
- JSON
- Markdown
- And many more...

Specify the language after the opening code fence:

````markdown
```javascript
console.log("Hello, world!");
```
````

## SEO Features

The blog includes SEO optimization:

- Dynamic page titles for each blog post
- Meta description tags for search engines
- Semantic HTML structure
- Mobile-responsive design
- Fast loading times with optimized React build

## Troubleshooting

### Issue: Blog posts not displaying locally

**Solution**:
- Ensure `blog-index.json` is in `frontend/public/`
- Check that markdown files exist at the paths specified in `blog-index.json`
- Clear browser cache and restart development server

### Issue: Styles not loading after build

**Solution**:
- Verify build completed successfully: `npm run build`
- Check `frontend/build/static/css/` contains CSS files
- Ensure you're serving from the `build/` directory, not `public/`

### Issue: Routes not working after deployment to S3

**Solution**:
- Set S3 static website hosting error document to `index.html`
- This enables client-side routing for all paths

## License

This project is provided as-is for portfolio and demonstration purposes.

## Contact

For questions or feedback, contact Alan at [your-contact-info].
