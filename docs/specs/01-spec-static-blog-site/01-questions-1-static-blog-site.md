# 01 Questions Round 1 - Static Blog Site

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Current Application Migration

What should happen to the existing authentication functionality and Hello World features?

- [x] (A) Remove all authentication code and Hello World functionality completely - fresh start as a blog
- [ ] (B) Keep authentication for future admin features (blog authoring), but make blog reading public
- [ ] (C) Keep the existing app separate and add blog as a new section
- [ ] (D) Archive the existing code but start fresh with a new React app for the blog
- [ ] (E) Other (describe)

## 2. Blog Entry Storage and Structure

How should blog entries be organized in the S3 bucket?

- [ ] (A) Flat structure: `blog-YYYY-MM-DD-title.md` in root directory
- [x] (B) Nested by year: `YYYY/blog-YYYY-MM-DD-title.md`
- [ ] (C) Nested by year/month: `YYYY/MM/blog-YYYY-MM-DD-title.md`
- [ ] (D) Each blog entry in its own directory: `blog-YYYY-MM-DD-title/index.md` (allows for images/assets per post)
- [ ] (E) Other (describe)

## 3. Blog Entry Metadata

Besides the date in the filename, what other metadata should blog entries support?

- [x] (A) Just title and date from filename - keep it simple
- [ ] (B) Frontmatter in MD file (title, date, author, tags, description)
- [ ] (C) Separate JSON metadata file for each blog entry
- [ ] (D) Title from filename, everything else in frontmatter
- [ ] (E) Other (describe)

## 4. Blog List/Home Page

What should users see when they first visit the blog?

- [x] (A) Full list of all blog posts with titles and dates, newest first
- [ ] (B) List with title, date, and excerpt/preview of each post
- [ ] (C) Just the most recent blog post, with navigation to others
- [ ] (D) A landing page with featured/pinned posts plus a chronological list
- [ ] (E) Other (describe)

## 5. Individual Blog Post View

How should individual blog posts be displayed?

- [ ] (A) Single page app - clicking a post loads and renders it on the same page
- [x] (B) Separate route for each post (e.g., `/blog/YYYY-MM-DD-title`)
- [ ] (C) Modal/overlay that opens when clicking a post from the list
- [ ] (D) Direct links to the MD file in S3 (browser renders raw markdown)
- [ ] (E) Other (describe)

## 6. Markdown Rendering Features

What markdown features do you need to support?

- [ ] (A) Basic markdown only (headings, paragraphs, bold, italic, links, lists)
- [ ] (B) Basic + code syntax highlighting for code blocks
- [ ] (C) Basic + code highlighting + images
- [x] (D) Full GitHub-flavored markdown (tables, task lists, strikethrough, etc.)
- [ ] (E) Other (describe)

## 7. Images and Assets

How should images and other assets (if any) be handled for blog posts?

- [x] (A) No images needed for now - text-only blog
- [ ] (B) Images stored in S3 alongside blog entries, referenced in markdown
- [ ] (C) Images in a separate `/images` or `/assets` directory in S3
- [ ] (D) External image hosting (imgur, cloudinary, etc.)
- [ ] (E) Other (describe)

## 8. S3 Bucket Setup

Do you already have an S3 bucket configured, or should the spec include setup instructions?

- [x] (A) I have an S3 bucket ready - just need the code to work with it
- [ ] (B) Include instructions for setting up a new S3 bucket for static hosting
- [ ] (C) Include instructions AND sample blog entries to get started
- [ ] (D) Just the code - I'll handle infrastructure separately
- [ ] (E) Other (describe)

## 9. Blog Entry Creation

For this "simple first version", how will new blog entries be created?

- [x] (A) Manually create MD files and upload to S3 using AWS Console
- [ ] (B) Manually create MD files and use AWS CLI to upload
- [ ] (C) Local MD files that get deployed to S3 as part of build process
- [ ] (D) Simple script/tool to create and upload blog entries
- [ ] (E) Other (describe)

## 10. Navigation and Filtering

What navigation/filtering features are needed?

- [x] (A) Just chronological list - no filtering needed
- [ ] (B) Pagination (show 10 posts per page)
- [ ] (C) Filter by tags/categories
- [ ] (D) Search functionality
- [ ] (E) Simple "newer/older" navigation between posts
- [ ] (F) Multiple of the above (describe which)

## 11. Design and Styling

What's your vision for the blog's appearance?

- [x] (A) Minimal/clean design - focus on readability
- [ ] (B) Match the current app's styling
- [ ] (C) I have a specific design in mind (describe or provide mockup)
- [ ] (D) Use a pre-built blog template/theme
- [ ] (E) Other (describe)

## 12. Proof Artifacts

What would demonstrate that this blog feature is working correctly?

- [ ] (A) URL to deployed S3 static site showing blog list
- [ ] (B) Screenshot of blog list page and individual blog post
- [ ] (C) Sample MD files in S3 bucket
- [x] (D) Working localhost demo with sample blog entries
- [ ] (E) All of the above
- [ ] (F) Other (describe)
