# 04-tasks-blog-styling-consistency.md

## Relevant Files

- `frontend/src/App.css` - Main CSS file containing all blog styling that needs typography and color updates

### Notes

- No tests are required for this feature as it involves CSS styling updates only
- Use manual browser testing to verify visual changes
- Follow the repository's existing CSS organization with clear section comments
- Preserve all existing layout values (max-width, spacing, margins, padding)
- Preserve all existing link colors (#4a90e2) and hover effects
- Preserve all existing responsive breakpoints (768px)
- Use browser DevTools to inspect computed styles and verify accessibility (WCAG AA contrast ratios)

## Tasks

### [x] T1.0 Analyze Main Site and Update Typography

#### T1.0 Proof Artifact(s)

- File content: `frontend/src/App.css` shows updated font-family declarations matching main site demonstrates typography updates applied
- Screenshot: Blog list page showing updated fonts demonstrates typography visible in browser
- Screenshot: Blog post page showing updated fonts for headings, body text, and code blocks demonstrates complete typography coverage
- CLI: Browser DevTools inspection showing computed font-family values demonstrates fonts loading correctly

#### T1.0 Tasks

- [ ] T1.1 Use WebFetch to analyze https://vanarden.ca and identify font families used for body text, headings, and code
- [ ] T1.2 Update body font-family in `frontend/src/App.css` (line 9) to match main site (or keep current system font stack if already matching)
- [ ] T1.3 Review and update heading font-families throughout `App.css` to match main site if different from body font
- [ ] T1.4 Update code font-family in `App.css` (line 260) to match main site's monospace font stack while keeping monospace
- [ ] T1.5 Start development server with `npm start` and navigate to http://localhost:3000/blog
- [ ] T1.6 Verify typography updates on blog list page (headings, post titles, dates)
- [ ] T1.7 Navigate to a blog post and verify typography for post title, body text, headings (h1-h6), and code blocks
- [ ] T1.8 Use browser DevTools to inspect computed font-family values and confirm they match expectations
- [ ] T1.9 Take screenshots of blog list and blog post pages showing updated typography

### [x] T2.0 Update Color Scheme to Match Main Site

#### T2.0 Proof Artifact(s)

- File content: `frontend/src/App.css` shows updated color values (backgrounds, text, headings) demonstrates color scheme updates applied
- Screenshot: Blog list page showing updated background and text colors demonstrates color changes visible
- Screenshot: Blog post page showing updated colors throughout content demonstrates comprehensive color coverage
- CLI: Browser DevTools inspection showing contrast ratios meet WCAG AA demonstrates accessibility compliance

#### T2.0 Tasks

- [ ] T2.1 Use WebFetch to analyze https://vanarden.ca and identify color scheme (background, primary text, heading colors, accent colors)
- [ ] T2.2 Update body background-color in `frontend/src/App.css` (line 16) to match main site
- [ ] T2.3 Update body text color in `App.css` (line 15) to match main site primary text color
- [ ] T2.4 Update heading colors throughout `App.css` (lines 77, 116, 169, 208, 321) to match main site heading color
- [ ] T2.5 Update secondary text colors (dates, metadata) if different from main site
- [ ] T2.6 Review and update table header background (line 309) and table styles to align with main site palette
- [ ] T2.7 Review and update blockquote styling (line 330) to align with main site if applicable
- [ ] T2.8 Ensure link colors (#4a90e2) remain unchanged throughout the file as per spec constraints
- [ ] T2.9 Start development server with `npm start` and navigate to http://localhost:3000/blog
- [ ] T2.10 Verify color updates on blog list page (background, text, headings)
- [ ] T2.11 Navigate to a blog post and verify colors throughout content (background, text, headings, tables, blockquotes)
- [ ] T2.12 Use browser DevTools to check contrast ratios (text/background) and ensure WCAG AA compliance (minimum 4.5:1 for normal text, 3:1 for large text)
- [ ] T2.13 Take screenshots of blog list and blog post pages showing updated color scheme

### [x] T3.0 Update Header Styling to Align with Main Site

#### T3.0 Proof Artifact(s)

- File content: `frontend/src/App.css` header section shows updated background and text colors demonstrates header updates applied
- Screenshot: Blog header showing updated styling while maintaining "Alan's Blog" branding demonstrates header alignment with distinct branding
- Screenshot: Mobile view of header showing responsive behavior preserved demonstrates responsive functionality intact
- CLI: Browser DevTools inspection of header colors demonstrates header matches main site palette

#### T3.0 Tasks

- [ ] T3.1 Use WebFetch to analyze https://vanarden.ca header/navigation area and identify header styling approach (background color, text color, layout)
- [ ] T3.2 Update `.app-header` background-color in `frontend/src/App.css` (line 28) to align with main site palette
- [ ] T3.3 Update `.app-header` text color in `App.css` (line 29) to ensure proper contrast with new background
- [ ] T3.4 Ensure header maintains "Alan's Blog" branding distinction (verify h1 styling at line 35-39 is appropriate)
- [ ] T3.5 Verify header box-shadow (line 32) aligns with main site aesthetic or adjust if needed
- [ ] T3.6 Review responsive header styles (lines 52-54) to ensure mobile behavior is preserved
- [ ] T3.7 Start development server with `npm start` and navigate to http://localhost:3000/blog
- [ ] T3.8 Verify header styling on desktop view (background, text, branding)
- [ ] T3.9 Resize browser to mobile width (<768px) and verify header responsive behavior is preserved
- [ ] T3.10 Use browser DevTools to inspect header colors and verify they align with main site palette
- [ ] T3.11 Take screenshots of header on desktop and mobile views showing updated styling with distinct branding
