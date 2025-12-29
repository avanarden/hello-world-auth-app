# 02-tasks-automatic-blog-post-discovery.md

## Relevant Files

- `scripts/generate-blog-index.js` - Main index generation script that scans year directories and generates blog-index.json
- `package.json` - Root package.json requiring updates to add generate-index script and modify build script
- `README.md` - Project documentation requiring updates to document new automated workflow
- `frontend/public/blog-index.json` - Generated index file (will be created/overwritten by script)
- `frontend/public/2024/` - Existing year directory with three blog posts for backward compatibility testing
- `frontend/public/2025/blog-2025-01-01-test-post.md` - Test blog post file to create for verification (temporary)

### Notes

- The script uses only Node.js built-in modules (`fs`, `path`) - no additional dependencies required
- Script must run on Node.js 18+ (current project requirement)
- Use CommonJS format for the script (`.js` with `require`) to match project conventions
- Generated `blog-index.json` must maintain exact same structure as current manual version
- JSON output should use 2-space indentation for readability

## Tasks

### [x] 1.0 Create Blog Index Generation Script

**Purpose:** Implement a standalone Node.js script that scans year directories in `frontend/public/` and automatically generates `blog-index.json` from discovered markdown files.

#### 1.0 Proof Artifact(s)

- CLI: `npm run generate-index` successfully executes and generates `frontend/public/blog-index.json` demonstrates script execution
- File: `frontend/public/blog-index.json` contains all three existing blog posts from 2024 with correct metadata (slug, title, date, path) demonstrates proper parsing and generation
- CLI: Adding a new test markdown file `frontend/public/2025/blog-2025-01-01-test-post.md` and running script shows new entry in generated index demonstrates automatic discovery
- File: Generated index shows posts sorted by date descending (newest first) demonstrates correct sorting

#### 1.0 Tasks

- [x] 1.1 Create `scripts/` directory in the project root if it doesn't exist
- [x] 1.2 Create `scripts/generate-blog-index.js` with basic script structure and required imports (`fs`, `path`)
- [x] 1.3 Implement year directory scanning logic to find all directories matching pattern `YYYY/` in `frontend/public/`
- [x] 1.4 Implement markdown file discovery logic to find files matching pattern `blog-YYYY-MM-DD-*.md` in each year directory
- [x] 1.5 Implement filename parsing logic using regex pattern `blog-(\d{4}-\d{2}-\d{2})-(.*).md` to extract date and slug
- [x] 1.6 Implement title formatting function that converts slug (e.g., `my-first-post`) to display title (e.g., "My First Post")
- [x] 1.7 Implement blog post object creation with properties: `slug`, `title`, `date`, `path`
- [x] 1.8 Implement sorting logic to order posts by date descending (newest first)
- [x] 1.9 Implement JSON file writing logic to save formatted output to `frontend/public/blog-index.json` with 2-space indentation
- [x] 1.10 Add error handling for cases where no year directories or markdown files are found
- [x] 1.11 Add `generate-index` script to root `package.json` scripts section: `"generate-index": "node scripts/generate-blog-index.js"`
- [x] 1.12 Test script execution by running `npm run generate-index` and verifying output

### [x] 2.0 Integrate Index Generation into Build Process

**Purpose:** Integrate the index generation script into the npm build process so that `blog-index.json` is automatically regenerated before production builds.

#### 2.0 Proof Artifact(s)

- CLI: `npm run build` successfully generates index before building React app demonstrates build integration
- File: `frontend/build/blog-index.json` exists and contains current blog posts demonstrates index inclusion in build output
- CLI: Build process completes successfully end-to-end from index generation through React build demonstrates full workflow
- File: Root `package.json` shows updated build script with index generation demonstrates configuration change

#### 2.0 Tasks

- [x] 2.1 Update root `package.json` build script to run `generate-index` before frontend build: `"build": "npm run generate-index && cd frontend && npm run build"`
- [x] 2.2 Test build integration by running `npm run build` from project root and verifying index is generated first
- [x] 2.3 Verify that `frontend/build/blog-index.json` exists after build completes
- [x] 2.4 Verify that build process fails gracefully if index generation encounters errors
- [x] 2.5 Test that newly generated index is correctly included in the React build output

### [ ] 3.0 Update Documentation and Verify Backward Compatibility

**Purpose:** Update README with new automated workflow instructions and verify that existing blog posts work correctly with the automated system.

#### 3.0 Proof Artifact(s)

- File: Updated `README.md` includes new "Adding New Blog Posts" section with automated workflow demonstrates documentation completeness
- File: README documents `npm run generate-index` command and when to use it demonstrates command documentation
- Test: Running `npm run generate-index` on existing 2024 posts generates correct index demonstrates backward compatibility
- CLI: Following new README instructions to add a test post (create file, run script, verify in browser) works end-to-end demonstrates workflow clarity
- File: README specifies filename format requirement `blog-YYYY-MM-DD-title-slug.md` demonstrates format documentation

#### 3.0 Tasks

- [ ] 3.1 Update README.md "Adding New Blog Posts" section to document the new automated workflow
- [ ] 3.2 Update README to remove manual `blog-index.json` editing instructions
- [ ] 3.3 Document the `npm run generate-index` command, explaining when to use it (before local testing without full build)
- [ ] 3.4 Document that `npm run build` automatically regenerates the index, so manual generation is optional
- [ ] 3.5 Document the required filename format: `blog-YYYY-MM-DD-title-slug.md` with examples
- [ ] 3.6 Document the year directory requirement: files must be in `YYYY/` directory matching the year in filename
- [ ] 3.7 Update "Available Scripts" section to include `npm run generate-index` command
- [ ] 3.8 Test backward compatibility by running `npm run generate-index` and verifying all three 2024 posts appear correctly
- [ ] 3.9 Create a test blog post `frontend/public/2025/blog-2025-01-01-test-post.md` (create 2025 directory if needed)
- [ ] 3.10 Test the documented workflow by following README instructions to add the test post and verify it appears in the generated index
- [ ] 3.11 Clean up test post after verification (delete `frontend/public/2025/blog-2025-01-01-test-post.md` and empty 2025 directory)
