# 01-tasks-static-blog-site.md

## Relevant Files

- `package.json` - Root package file; remove backend-related scripts
- `frontend/package.json` - Add new dependencies (react-router-dom, react-markdown, remark-gfm, react-syntax-highlighter)
- `frontend/src/App.js` - Complete rewrite to remove authentication and implement routing
- `frontend/src/index.js` - May need minor updates for routing setup
- `frontend/src/App.css` - Create new styling for blog layout
- `frontend/src/components/BlogList.js` - New component for displaying list of blog posts
- `frontend/src/components/BlogPost.js` - New component for displaying individual blog post
- `frontend/src/components/NotFound.js` - New component for 404 error page
- `frontend/src/utils/blogUtils.js` - New utility functions for blog data parsing and formatting
- `frontend/public/blog-index.json` - New JSON file listing all blog posts
- `frontend/public/2024/blog-2024-01-15-sample-post.md` - Sample blog post #1
- `frontend/public/2024/blog-2024-03-20-another-post.md` - Sample blog post #2
- `frontend/public/2024/blog-2024-06-10-third-post.md` - Sample blog post #3
- `frontend/public/index.html` - Update title and meta tags
- `.env.example` - New file documenting environment variables (if needed)
- `README.md` - Update with blog setup and S3 deployment instructions
- `docs/specs/01-spec-static-blog-site/s3-bucket-structure-example.md` - New documentation file
- `backend/` - Entire directory to be removed

### Notes

- Follow React functional components with hooks pattern (existing convention)
- Use exact version locking for all new npm dependencies
- Components use PascalCase naming, utilities use camelCase naming
- The `public/` directory contents will be copied to the build output and accessible via relative paths
- Blog posts will be fetched using the Fetch API with relative URLs

## Tasks

### [x] 1.0 Remove Authentication Code and Establish Routing Foundation

#### 1.0 Proof Artifact(s)

- Screenshot: Home page at localhost:3000 showing "Alan's Blog" header and empty state message demonstrates clean slate
- CLI: `npm start` successfully starts without backend dependency demonstrates frontend-only operation
- Diff: Removal of authentication-related code and addition of React Router demonstrates codebase transformation

#### 1.0 Tasks

- [x] 1.1 Remove the entire `backend/` directory and all its contents
- [x] 1.2 Update root `package.json` to remove backend-related scripts (`start-backend`, `dev-backend`, `install-all`, modify `dev` script)
- [x] 1.3 Navigate to `frontend/` directory and install React Router: `npm install react-router-dom@6.22.0`
- [x] 1.4 Remove authentication-related dependencies from `frontend/package.json` (none currently, but verify)
- [x] 1.5 Update `frontend/public/index.html` to change title to "Alan's Blog"
- [x] 1.6 Create `frontend/src/App.css` with basic styling structure (header, main content area, responsive layout)
- [x] 1.7 Rewrite `frontend/src/App.js` to remove all authentication code and implement BrowserRouter with basic routes (home route `/` and blog post route `/blog/:slug`)
- [x] 1.8 Update `frontend/src/index.js` to wrap App with BrowserRouter if needed (or keep as-is if routing is handled in App.js)
- [x] 1.9 Add "Alan's Blog" header and empty state message ("No blog posts yet") to the home route
- [x] 1.10 Test by running `npm start` from frontend directory and verify no errors, header displays correctly

### [x] 2.0 Implement Blog List Page with Content Fetching from Blog Index

#### 2.0 Proof Artifact(s)

- Screenshot: Home page showing list of sample blog posts with titles and dates, sorted newest first demonstrates blog list functionality
- Screenshot: Clicking a blog post navigates to `/blog/YYYY-MM-DD-title` route demonstrates navigation
- File: `public/blog-index.json` with sample blog entries demonstrates blog metadata structure
- CLI: `npm start` shows blog list loaded from blog-index.json demonstrates content fetching

#### 2.0 Tasks

- [x] 2.1 Create `frontend/public/blog-index.json` with array of blog entries containing: `slug`, `title`, `date`, `path` fields for 3 sample posts
- [x] 2.2 Create `frontend/src/utils/` directory
- [x] 2.3 Create `frontend/src/utils/blogUtils.js` with utility functions: `formatBlogTitle(slug)` to convert "my-first-post" to "My First Post", `formatDate(dateString)` to format dates nicely, `sortByDateDesc(posts)` to sort posts by date
- [x] 2.4 Create `frontend/src/components/` directory
- [x] 2.5 Create `frontend/src/components/BlogList.js` component that fetches `/blog-index.json`, displays posts sorted by date (newest first), shows title and formatted date for each post, handles loading state, handles errors gracefully
- [x] 2.6 Each blog entry in BlogList should be a clickable link using React Router's `Link` component, navigating to `/blog/:slug`
- [x] 2.7 Update `frontend/src/App.js` to import and render BlogList component on the home route
- [x] 2.8 Add CSS styling to `frontend/src/App.css` for blog list layout (clean, minimal design with proper spacing)
- [x] 2.9 Test by running `npm start` and verifying blog list displays, posts are sorted correctly, clicking navigates to correct route
- [x] 2.10 Verify browser console shows no errors and network request for blog-index.json succeeds

### [~] 3.0 Implement Markdown Rendering and Blog Post Fetching

#### 3.0 Proof Artifact(s)

- Screenshot: Blog post page showing rendered markdown with headings, lists, bold, italic, links demonstrates basic markdown rendering
- Screenshot: Blog post showing code blocks with syntax highlighting demonstrates code support
- Screenshot: Blog post showing table and task list demonstrates GFM features
- URL: Navigating to `/blog/2024-01-15-sample-post` fetches and renders markdown from relative path demonstrates end-to-end functionality
- File: Sample markdown files in `public/2024/` directory demonstrates content structure

#### 3.0 Tasks

- [x] 3.1 Install markdown rendering dependencies: `npm install react-markdown@9.0.1 remark-gfm@4.0.0 react-syntax-highlighter@15.5.0` in frontend directory
- [x] 3.2 Create `frontend/public/2024/` directory for blog post files
- [x] 3.3 Create `frontend/public/2024/blog-2024-01-15-sample-post.md` with sample content including: headings, paragraphs, bold/italic text, links, lists, code blocks with JavaScript/Python examples, tables, task lists
- [x] 3.4 Create `frontend/public/2024/blog-2024-03-20-another-post.md` with different sample content to demonstrate variety
- [x] 3.5 Create `frontend/public/2024/blog-2024-06-10-third-post.md` with additional sample content
- [x] 3.6 Update `frontend/public/blog-index.json` to reference the correct paths for these three posts (e.g., `/2024/blog-2024-01-15-sample-post.md`)
- [x] 3.7 Create `frontend/src/components/BlogPost.js` component that: uses `useParams()` to get slug from URL, fetches markdown file from the path, displays loading state, renders markdown using react-markdown with remark-gfm plugin, includes syntax highlighting for code blocks using react-syntax-highlighter, shows blog title and date at top, includes "Back to Blog List" link, handles errors (404 for missing posts)
- [x] 3.8 Update `frontend/src/App.js` to add Route for `/blog/:slug` that renders BlogPost component
- [x] 3.9 Add CSS styling to `frontend/src/App.css` for blog post layout: max-width 700-800px for readability, proper typography for headings, spacing for paragraphs, styling for code blocks, table styling, task list styling
- [x] 3.10 Test by navigating to `/blog/2024-01-15-sample-post` and verifying: markdown renders correctly, code highlighting works, tables and task lists display properly, back navigation works
- [x] 3.11 Test error handling by navigating to invalid blog URL and verifying error message displays

### [ ] 4.0 Add SEO, Error Handling, and Deployment Preparation

#### 4.0 Proof Artifact(s)

- Screenshot: Blog post page source showing meta tags (title, description) demonstrates SEO implementation
- Screenshot: Navigating to invalid route shows 404 page demonstrates error handling
- Screenshot: Failed content fetch shows user-friendly error message demonstrates graceful degradation
- CLI: `npm run build` completes successfully and creates `build/` directory demonstrates production readiness
- File: `docs/specs/01-spec-static-blog-site/s3-bucket-structure-example.md` demonstrates sample S3 structure documentation
- File: Updated README.md with blog setup and S3 deployment instructions demonstrates documentation

#### 4.0 Tasks

- [ ] 4.1 Install react-helmet-async for SEO meta tags: `npm install react-helmet-async@2.0.4` in frontend directory
- [ ] 4.2 Update `frontend/src/index.js` to wrap App with HelmetProvider
- [ ] 4.3 Update `frontend/src/components/BlogPost.js` to add Helmet component with dynamic title and description meta tags based on blog post content
- [ ] 4.4 Update `frontend/src/components/BlogList.js` to add Helmet component with appropriate title and description for the blog list page
- [ ] 4.5 Create `frontend/src/components/NotFound.js` component with 404 message and link back to home
- [ ] 4.6 Update `frontend/src/App.js` to add catch-all Route (`path="*"`) that renders NotFound component
- [ ] 4.7 Enhance error handling in BlogPost component to display user-friendly messages for network errors, missing files, and other failures
- [ ] 4.8 Enhance error handling in BlogList component to display user-friendly message if blog-index.json fails to load
- [ ] 4.9 Create `docs/specs/01-spec-static-blog-site/s3-bucket-structure-example.md` documenting: expected S3 bucket structure, file naming conventions, sample blog-index.json format, CORS configuration requirements, static website hosting settings
- [ ] 4.10 Update root `README.md` to replace Hello World documentation with: blog site description, local development setup instructions, how to add new blog posts, S3 deployment instructions, reference to s3-bucket-structure-example.md
- [ ] 4.11 Create `.env.example` file (if environment variables are needed, otherwise skip this step)
- [ ] 4.12 Run `npm run build` from frontend directory and verify build completes successfully with no errors
- [ ] 4.13 Verify `frontend/build/` directory contains: index.html, static assets (JS, CSS), blog-index.json, 2024/ directory with markdown files
- [ ] 4.14 Test production build locally by serving the build directory (e.g., using `npx serve -s build`) and verifying all functionality works
