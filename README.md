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
- `npm run build` - Build the production bundle
- `npm install` - Install dependencies

From the `frontend/` directory:

- `npm start` - Start the development server
- `npm run build` - Create production build in `frontend/build/`
- `npm test` - Run tests (if configured)

## Adding New Blog Posts

### Step 1: Create the Markdown File

Create a new markdown file in the appropriate year directory under `frontend/public/`:

```bash
# Example for a post on March 15, 2025
touch frontend/public/2025/blog-2025-03-15-my-new-post.md
```

**File naming convention**: `YYYY/blog-YYYY-MM-DD-title-slug.md`

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

### Step 3: Update the Blog Index

Edit `frontend/public/blog-index.json` and add an entry for your new post:

```json
{
  "slug": "2025-03-15-my-new-post",
  "title": "My New Post",
  "date": "2025-03-15",
  "path": "/2025/blog-2025-03-15-my-new-post.md"
}
```

Add the new entry to the beginning of the array to show it first in the list.

### Step 4: Test Locally

```bash
npm start
```

Navigate to `http://localhost:3000` and verify:
- Your new post appears in the blog list
- Clicking the post loads and renders the markdown correctly
- All formatting, code blocks, and links work as expected

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
