# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev server (runs at http://localhost:3000/blog)
npm start

# Build for production
npm run build

# Run all tests (frontend + scripts)
npm test

# Run tests separately
npm run test:frontend    # React component/util tests
npm run test:scripts     # Build script tests

# Run tests with coverage
npm run test:coverage

# Regenerate blog index from markdown files
npm run generate-index
```

To run a single test file, use the frontend or scripts jest config directly:
```bash
cd frontend && npx react-scripts test --watchAll=false BlogList.test.js
npx jest --config jest.config.scripts.js generate-blog-index.test.js
```

## Architecture

This is a **static blog site** built with React (CRA), designed for deployment to Amazon S3.

**Content pipeline**: Markdown files in `frontend/public/YYYY/` → build script generates `frontend/public/blog-index.json` → React app fetches index and renders posts client-side.

**Blog post naming**: `blog-YYYY-MM-DD-slug.md` (e.g., `blog-2024-12-01-hello-world.md`)

**Key directories**:
- `frontend/public/YYYY/` — Blog post markdown files organized by year
- `scripts/generate-blog-index.js` — Build-time script that discovers posts, extracts metadata/summaries, generates index JSON
- `frontend/src/components/` — React components (BlogList, BlogPost, NotFound)
- `frontend/src/utils/blogUtils.js` — Formatting helpers (formatTitle, formatDate, sortByDateDesc)
- `docs/specs/` — Feature specifications; `docs/plans/` — Design documents

**Routing**: React Router with `/blog` basename. Routes: `/` (listing), `/blog/:slug` (post), `*` (404).

**Summary generation**: The build script strips markdown to plain text and extracts ~150 chars at a word boundary for each post's summary field in the index.

## Testing

- **Framework**: Jest + React Testing Library (frontend), Jest with Node environment (scripts)
- **Frontend tests** mock `fetch` for blog data; **script tests** use temporary directories for filesystem isolation
- Tests live in `__tests__/` directories alongside the code they test
- Coverage targets: utilities 100%, components 80%+, scripts 90%+

## Styling

Single CSS file at `frontend/src/App.css`. Syntax highlighting uses VS Code Dark Plus theme via react-syntax-highlighter.
