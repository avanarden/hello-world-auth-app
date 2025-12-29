# 02 Questions Round 1 - Automatic Blog Post Discovery

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. Discovery Mechanism

How should the system discover markdown files in year directories?

- [x] (A) Build-time generation: Scan directories during `npm run build` and generate a static index file blog-index.json
- [ ] (B) Runtime discovery: Application scans directories when it loads (requires server or file system access)
- [x] (C) Development script: Run a manual script (e.g., `npm run generate-index`) to update the index before building
- [ ] (D) Git hook: Automatically update index when markdown files are committed
- [ ] (E) Other (describe)

## 2. File Organization and Naming

What file naming convention and organization should be supported?

- [x] (A) Keep current format: `YYYY/blog-YYYY-MM-DD-title.md` (year in both directory and filename)
- [ ] (B) Simplified format: `YYYY/blog-MM-DD-title.md` (year only in directory name)
- [ ] (C) Flexible format: `YYYY/*.md` (any markdown file in year directory, extract date from frontmatter or filename)
- [ ] (D) Multiple formats: Support both current and new formats for backward compatibility
- [ ] (E) Other (describe)

## 3. Metadata Extraction

How should the system extract blog post metadata (title, date, etc.)?

- [x] (A) Filename only: Extract everything from filename like current approach (e.g., `blog-2025-03-15-my-post.md`)
- [ ] (B) Frontmatter: Use YAML frontmatter in markdown files (e.g., `---\ntitle: My Post\ndate: 2025-03-15\n---`)
- [ ] (C) First heading: Use first H1 in markdown as title, date from filename or frontmatter
- [ ] (D) Mixed approach: Support both filename parsing and optional frontmatter (frontmatter overrides filename)
- [ ] (E) Other (describe)

## 4. Backward Compatibility

What should happen to the existing `blog-index.json` file and current blog posts?

- [ ] (A) Replace completely: Delete `blog-index.json`, all posts use automatic discovery
- [ ] (B) Deprecate gracefully: Keep existing index for current posts, use automatic discovery for new posts
- [ ] (C) Migrate: Convert existing posts to new format as part of this feature
- [ ] (D) Hybrid: Support both manual index and automatic discovery (manual entries override auto-discovered ones)
- [x] (E) Other `blog-index.json` should be re build with `npm run build` & `npm run generate-index` to create new indexing

## 5. Additional Metadata

What additional metadata should be supported for blog posts?

- [x] (A) None: Keep it simple with just title and date
- [ ] (B) Basic: Add tags/categories for filtering
- [ ] (C) Extended: Add tags, author, description/excerpt for SEO
- [ ] (D) Full frontmatter: Support any custom fields in frontmatter (flexible schema)
- [ ] (E) Other (describe)

## 6. Error Handling

How should the system handle malformed or invalid markdown files?

- [ ] (A) Skip silently: Invalid files are ignored, only valid posts appear
- [ ] (B) Log warnings: Display console warnings during build but don't fail
- [ ] (C) Fail build: Build fails if any markdown file is malformed
- [ ] (D) Validation report: Generate a report of issues but continue building
- [x] (E) Other assume markdown is well formed

## 7. Development Experience

What's the expected workflow when adding a new blog post?

- [ ] (A) Drop and done: Create markdown file in year directory, refresh browser (automatic)
- [x] (B) Drop and rebuild: Create markdown file, run build command, then view
- [x] (C) Drop and script: Create markdown file, run generation script, then view
- [ ] (D) Current workflow is fine: Manual index update is acceptable
- [ ] (E) Other (describe)
