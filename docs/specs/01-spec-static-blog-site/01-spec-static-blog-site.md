# 01-spec-static-blog-site.md

## Introduction/Overview

This specification describes the transformation of the current Hello World full-stack application into a static blog site hosted on Amazon S3. The blog will fetch markdown-formatted blog entries directly from S3 and render them in a clean, readable interface. Blog entries will be organized by year in the S3 bucket, with titles and dates encoded in filenames for simplicity.

## Goals

- Replace the current authenticated full-stack application with a static, publicly accessible blog site
- Enable reading and rendering of markdown blog entries stored in Amazon S3
- Provide a simple, maintainable blog platform with minimal infrastructure complexity
- Support GitHub-flavored markdown for rich text formatting
- Create a clean, minimal reading experience focused on content

## User Stories

**As a blog reader**, I want to see a list of all available blog posts so that I can browse and choose what to read.

**As a blog reader**, I want to click on a blog post title so that I can read the full content of that post.

**As a blog reader**, I want blog posts to be rendered in a readable format so that I can enjoy well-formatted content with headings, lists, code blocks, and tables.

**As a blog author**, I want to create new blog posts by uploading markdown files to S3 so that I can publish content without needing a complex CMS.

**As a blog author**, I want blog posts to be organized by year so that the S3 bucket structure remains manageable as the blog grows.

## Demoable Units of Work

### Unit 1: Blog List Page

**Purpose:** Display all blog posts in chronological order, allowing readers to discover and navigate to content.

**Functional Requirements:**
- The system shall fetch a list of blog entries from the S3 bucket
- The system shall extract title and date information from filenames in the format `blog-YYYY-MM-DD-title.md`
- The system shall display blog posts in a list sorted by date, newest first
- The system shall convert filename titles (e.g., `my-first-post`) to display format (e.g., "My First Post")
- The user shall be able to click on a blog post title to navigate to the full post
- The system shall handle empty blog list gracefully with appropriate messaging

**Proof Artifacts:**
- Screenshot: Home page at localhost:3000 showing list of sample blog posts demonstrates blog discovery and listing functionality
- CLI: `npm start` successfully starts development server and displays blog list demonstrates local development setup

### Unit 2: Individual Blog Post View with Markdown Rendering

**Purpose:** Display the full content of a single blog post with proper markdown rendering, providing a quality reading experience.

**Functional Requirements:**
- The system shall support separate routes for each blog post in the format `/blog/YYYY-MM-DD-title`
- The system shall fetch the markdown content from S3 for the requested blog post
- The system shall render GitHub-flavored markdown including: headings, paragraphs, bold, italic, links, lists, code blocks with syntax highlighting, tables, task lists, and strikethrough
- The system shall display the blog post title and date at the top of the post
- The user shall be able to navigate back to the blog list from any blog post
- The system shall handle invalid or missing blog post routes with appropriate error messaging

**Proof Artifacts:**
- Screenshot: Individual blog post page showing rendered markdown content demonstrates markdown rendering capability
- Screenshot: Blog post with code blocks, tables, and various markdown elements demonstrates GitHub-flavored markdown support
- URL: Navigating to `/blog/2024-01-15-sample-post` shows the rendered post demonstrates routing functionality

### Unit 3: S3 Integration and Static Hosting Preparation

**Purpose:** Configure the application to fetch blog entries from Amazon S3 and prepare the codebase for static site deployment.

**Functional Requirements:**
- The system shall fetch blog entry files from the configured S3 bucket
- The system shall support CORS-enabled S3 bucket access for fetching markdown files
- The system shall list available blog entries by querying the S3 bucket structure (organized by year: `YYYY/blog-YYYY-MM-DD-title.md`)
- The application shall be buildable as a static site deployable to S3
- The system shall handle S3 access errors gracefully with user-friendly error messages
- The system shall support configuration of S3 bucket name and region via environment variables

**Proof Artifacts:**
- Screenshot: Blog list successfully fetching from actual S3 bucket demonstrates S3 integration
- CLI: `npm run build` creates optimized production build demonstrates static site build process
- Directory: `build/` or `dist/` folder contains deployable static files demonstrates deployment readiness

## Non-Goals (Out of Scope)

1. **Blog authoring interface**: No web-based UI for creating or editing blog posts. Blog entries will be created manually and uploaded via AWS Console.

2. **Image support**: This first version is text-only. Images, embedded media, and other assets are not supported.

3. **Authentication/authorization**: The blog is completely public. No login, user management, or access control features.

4. **Search and filtering**: No search functionality, tag filtering, category filtering, or pagination. Simple chronological list only.

5. **Comments and engagement**: No commenting system, likes, shares, or other social features.

6. **RSS/Atom feeds**: No feed generation for blog subscribers.

7. **Analytics and tracking**: No built-in analytics, view counts, or visitor tracking.

8. **Backend API**: Complete removal of the Node.js/Express backend. The site is purely static.

9. **S3 bucket setup**: The specification assumes an S3 bucket is already configured. Setup instructions and infrastructure-as-code are not included.

## Design Considerations

**Minimal/Clean Design:**
- Focus on typography and readability
- Clean layout with generous white space
- Simple navigation with clear visual hierarchy
- Responsive design that works on mobile and desktop
- Consistent styling for markdown elements (headings, code blocks, lists, tables)
- Subtle visual feedback for interactive elements (links, buttons)

**Layout Structure:**
- Blog list page: Title/header, list of posts with dates, minimal footer
- Individual post page: Title, date, rendered markdown content, back navigation
- Maximum content width for optimal reading line length (approximately 700-800px)

**No specific mockups or design assets are required.** The implementation should follow modern web design best practices for reading-focused applications.

## Repository Standards

**Code Organization:**
- Continue using React functional components with hooks pattern
- Maintain separation of concerns (components, utilities, styling)
- Follow existing file naming conventions (PascalCase for components, camelCase for utilities)

**Dependencies:**
- Use npm for package management with exact version locking
- Add markdown rendering library (e.g., react-markdown, marked, or remark)
- Add syntax highlighting library for code blocks (e.g., prism.js, highlight.js)
- Add AWS SDK for JavaScript for S3 integration
- Remove unused authentication and backend-related dependencies

**Development Workflow:**
- Maintain `npm start` for local development
- Maintain `npm run build` for production builds
- Update scripts to remove backend-related commands

**Documentation:**
- Update README.md to reflect the blog application and S3 setup requirements
- Include sample blog entry format and naming conventions
- Document environment variables needed (S3 bucket name, region)

## Technical Considerations

**S3 Integration:**
- Use AWS SDK for JavaScript (v3) for S3 interactions
- Configure S3 bucket to allow public read access for blog entries
- Ensure S3 bucket has CORS configuration to allow web browser requests
- Implement client-side fetching of markdown files from S3

**Routing:**
- Use React Router for client-side routing
- Support both blog list view (home route `/`) and individual post view (`/blog/YYYY-MM-DD-title`)
- Implement 404 handling for invalid blog post URLs

**Markdown Rendering:**
- Choose a GitHub-flavored markdown (GFM) compatible library
- Implement syntax highlighting for code blocks
- Ensure safe rendering (sanitize HTML if markdown library outputs raw HTML)

**Static Site Deployment:**
- Build output must be pure static files (HTML, CSS, JS)
- Configure React build process for S3 deployment
- Ensure client-side routing works with S3 static hosting (handle index.html fallback)

**Performance:**
- Implement lazy loading for blog content
- Consider caching strategies for S3 requests
- Optimize bundle size by removing authentication and backend code

**File Naming Convention:**
- S3 structure: `YYYY/blog-YYYY-MM-DD-title.md`
- Example: `2024/blog-2024-01-15-my-first-post.md`
- Title extraction: convert hyphens to spaces, capitalize words

## Security Considerations

**S3 Access:**
- S3 bucket should allow public read-only access for blog entries
- S3 access keys/secrets should NOT be embedded in client-side code
- Use S3 bucket policies for public read access instead of requiring credentials in the application

**Configuration Management:**
- S3 bucket name and region can be stored in environment variables
- Environment variables should be injected at build time (not runtime) for static sites
- Create `.env.example` file with required variables (do not commit actual `.env` with sensitive data)

**Content Security:**
- Ensure markdown rendering library sanitizes potentially malicious content
- Implement Content Security Policy headers if possible through S3 bucket configuration

**No Sensitive Data in Proof Artifacts:**
- Screenshots and demos should use sample blog content only
- Do not include actual S3 bucket names or AWS account information in committed proof artifacts
- Use placeholder/example bucket names in documentation

## Success Metrics

1. **Functionality**: All blog posts stored in S3 are successfully listed and rendered
2. **Performance**: Blog list loads in under 2 seconds on standard broadband connection
3. **Build Success**: `npm run build` completes without errors and produces deployable static files
4. **Code Cleanliness**: All authentication and backend code is removed, reducing bundle size by at least 40%
5. **User Experience**: Blog posts are readable and properly formatted with all markdown elements rendering correctly

## Open Questions

1. Should we include a sample configuration file showing expected S3 bucket structure for first-time setup? A: yes
2. Do you want a "About" or "Home" page separate from the blog list, or should the blog list be the root page? A: list on the root page
3. Should we include basic SEO meta tags (title, description) for each blog post? A: Yes
4. What should the application title/header be for the blog site? A: Alan's Blog
