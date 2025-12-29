# 02-spec-automatic-blog-post-discovery.md

## Introduction/Overview

This specification describes an automated system for discovering and indexing blog posts from markdown files organized in year directories. Currently, adding a new blog post requires manually updating `blog-index.json`. This feature automates that process by scanning year directories (e.g., `2025/`) for markdown files and generating the index file automatically during build time or via a manual script command.

## Goals

- Eliminate manual editing of `blog-index.json` when adding new blog posts
- Automate blog post discovery by scanning year directories for markdown files
- Provide both build-time and on-demand index generation via npm scripts
- Maintain backward compatibility with existing blog post format and structure
- Keep the solution simple with minimal configuration and no additional dependencies

## User Stories

**As a blog author**, I want to add a new blog post by simply creating a markdown file in a year directory so that I don't have to manually edit the index file.

**As a blog author**, I want to run `npm run generate-index` so that I can quickly regenerate the blog index without doing a full build.

**As a blog author**, I want the blog index to be automatically generated during `npm run build` so that I don't forget to update it before deploying.

**As a developer**, I want the existing blog post format and structure to remain unchanged so that current posts continue to work without modification.

## Demoable Units of Work

### Unit 1: Index Generation Script

**Purpose:** Create a standalone Node.js script that scans year directories and generates `blog-index.json` from discovered markdown files.

**Functional Requirements:**
- The system shall scan all year directories in `frontend/public/` matching the pattern `YYYY/` (e.g., `2024/`, `2025/`)
- The system shall identify markdown files matching the pattern `blog-YYYY-MM-DD-*.md` in each year directory
- The system shall extract metadata from each filename: date (YYYY-MM-DD) and title slug (the portion after the date)
- The system shall generate a formatted title from the slug by removing hyphens and capitalizing words
- The system shall create a `blog-index.json` file in `frontend/public/` with an array of blog post objects
- Each blog post object shall contain: `slug`, `title`, `date`, and `path` properties
- The system shall sort blog posts by date in descending order (newest first)
- The system shall be executable via `npm run generate-index` command

**Proof Artifacts:**
- CLI: `npm run generate-index` successfully generates `blog-index.json` demonstrates script execution
- File: `frontend/public/blog-index.json` contains correctly formatted blog post entries demonstrates proper index generation
- CLI: Running script after adding new markdown file shows new entry in generated index demonstrates automatic discovery

### Unit 2: Build Integration

**Purpose:** Integrate the index generation script into the build process so that the blog index is automatically updated during production builds.

**Functional Requirements:**
- The system shall execute the index generation script before the React build process runs
- The `npm run build` command shall automatically regenerate `blog-index.json` before building the application
- The build process shall fail if the index generation script encounters errors
- The generated index file shall be included in the production build output
- The build integration shall work on both local development machines and CI/CD environments

**Proof Artifacts:**
- CLI: `npm run build` successfully generates index and completes build demonstrates build integration
- Directory: `frontend/build/blog-index.json` exists and contains current posts demonstrates index inclusion in build
- CLI: Adding a new markdown file and running build shows new post in deployed application demonstrates end-to-end workflow

### Unit 3: Documentation and Migration

**Purpose:** Update documentation to reflect the new automated workflow and verify existing blog posts work with the automated system.

**Functional Requirements:**
- The README shall document the new workflow for adding blog posts (create file, run script or build)
- The README shall include the `npm run generate-index` command and when to use it
- The system shall successfully generate an index from existing blog posts in the `2024/` directory
- The documentation shall specify the required filename format: `blog-YYYY-MM-DD-title-slug.md`
- The documentation shall explain that year directories must match the year in filenames (e.g., `2025/blog-2025-*.md`)

**Proof Artifacts:**
- File: Updated README.md contains new workflow instructions demonstrates documentation completeness
- Test: Existing blog posts from 2024 appear correctly after index regeneration demonstrates backward compatibility
- CLI: Following new README instructions successfully adds a test blog post demonstrates workflow clarity

## Non-Goals (Out of Scope)

1. **Frontmatter support**: No parsing of YAML frontmatter or metadata from within markdown files. All metadata is extracted from filenames.

2. **Flexible file naming**: Only the current format `blog-YYYY-MM-DD-title.md` is supported. Alternative naming schemes are not included.

3. **Additional metadata fields**: No support for tags, categories, author, excerpts, or other extended metadata beyond title and date.

4. **Error handling for malformed files**: The system assumes all markdown files are well-formed. Validation and error reporting for invalid filenames or content is not included.

5. **Real-time watching**: No file system watching for automatic regeneration during development. Index must be regenerated manually via script or build.

6. **Custom directory structures**: Only year-based directories (`YYYY/`) in `frontend/public/` are supported. Custom organizational schemes are not included.

7. **Git hooks**: No automatic index regeneration via git hooks or pre-commit actions.

8. **Migration script**: No automated migration of existing workflow. The index generation simply replaces manual editing with automatic generation.

## Design Considerations

No specific design requirements identified. This is a build-time automation feature with no user-facing UI changes. The blog appearance and user experience remain identical to the current implementation.

## Repository Standards

**Code Organization:**
- Place the index generation script in a logical location (e.g., `scripts/generate-blog-index.js` or similar)
- Follow existing Node.js patterns if other build scripts exist in the repository
- Use ES modules or CommonJS consistently with the rest of the project

**Dependencies:**
- Use only Node.js built-in modules (fs, path) - no additional npm dependencies required
- Ensure the script runs on Node.js 18+ (current project requirement)

**NPM Scripts:**
- Add `generate-index` script to `package.json` in the root directory
- Integrate with existing `build` script using pre-build hooks or script chaining
- Follow existing npm script naming conventions

**Documentation:**
- Update README.md to document the new workflow
- Include examples of proper filename format
- Document both `npm run generate-index` and `npm run build` workflows

## Technical Considerations

**File System Operations:**
- Use Node.js `fs` module for reading directories and checking file existence
- Use `path` module for cross-platform path handling
- Scan recursively or explicitly check year directories (YYYY pattern)

**Script Location:**
- Script can be placed in `scripts/` directory or root level depending on repository conventions
- Script should be executable from root directory via npm script

**Build Process Integration:**
- Modify root `package.json` build script to run index generation first
- Use script chaining (e.g., `"build": "npm run generate-index && cd frontend && npm run build"`)
- Consider using `prebuild` npm script hooks for cleaner integration

**Filename Parsing:**
- Extract date using regex pattern: `blog-(\d{4}-\d{2}-\d{2})-(.*).md`
- Extract slug from the portion after the date
- Generate display title by splitting slug on hyphens and capitalizing each word

**Index File Format:**
- Maintain exact same JSON structure as current `blog-index.json`
- Ensure consistent property ordering: `slug`, `title`, `date`, `path`
- Sort by date descending before writing to file
- Use proper JSON formatting with 2-space indentation for readability

**Year Directory Discovery:**
- Scan `frontend/public/` for directories matching 4-digit year pattern (e.g., `/^\d{4}$/`)
- Include only directories, not files
- Handle case where no year directories exist gracefully

## Security Considerations

**No Sensitive Data:**
- Script operates only on local filesystem during build time
- No external API calls or network requests
- No sensitive credentials or secrets needed

**File System Access:**
- Script only reads from and writes to `frontend/public/` directory
- No risk of overwriting files outside the blog post structure
- Generated `blog-index.json` is a public asset (no security concerns)

**Proof Artifacts:**
- All proof artifacts (screenshots, generated files) are safe to commit to version control
- No configuration files or environment variables contain sensitive data

## Success Metrics

1. **Automation Success**: Adding a new blog post requires only creating a markdown file and running build/script (no manual index editing)
2. **Build Integration**: `npm run build` successfully generates index 100% of the time
3. **Backward Compatibility**: All existing blog posts (3 posts in `2024/` directory) appear correctly after automated index generation
4. **Performance**: Index generation completes in under 1 second for up to 100 blog posts
5. **Developer Experience**: New workflow is documented clearly enough that a new contributor can add a blog post following README instructions

## Open Questions

No open questions at this time.
