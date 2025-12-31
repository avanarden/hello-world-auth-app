# Testing Design: Blog Index Generator Script

**Date:** 2025-12-30
**Status:** Approved
**Context:** Add comprehensive testing for `scripts/generate-blog-index.js` build script

---

## Overview

Add testing for the blog index generator script that runs at build time to scan year directories and generate `blog-index.json`. This script is critical build infrastructure that currently lacks test coverage.

---

## Testing Strategy

### Hybrid Testing Approach

We'll use a hybrid approach that balances confidence with maintainability:

**Unit Tests (with Jest mocks):**
- `formatTitle()` - Pure function, no I/O, perfect for isolated testing
- Test various slug formats: simple slugs, multi-word slugs, edge cases like single characters, numbers, special handling

**Integration Tests (with real file system):**
- `findYearDirectories()` - Create temp directories with year patterns (2024, 2025, invalid names)
- `findBlogPosts()` - Create temp directories with real markdown files following the naming convention
- `generateBlogIndex()` - End-to-end test creating a full directory structure and verifying the generated JSON

**Rationale:**
- Unit tests for `formatTitle()` are fast and cover all edge cases easily
- File system operations need real integration tests to catch path issues, permission problems, and ensure cross-platform compatibility
- Integration tests use Node's `fs` with temporary directories that are cleaned up after each test

**Test Utilities:**
Create helper functions for integration tests to set up/tear down temporary file structures, making tests readable and reducing duplication.

---

## Code Refactoring for Testability

### Minimal Changes to Preserve CLI Functionality

The script currently executes immediately when loaded. We'll make minimal changes to support testing while preserving its CLI functionality.

### Changes to `scripts/generate-blog-index.js`

**1. Export the functions** - Add at the bottom (before the execution block):

```javascript
module.exports = {
  formatTitle,
  findYearDirectories,
  findBlogPosts,
  generateBlogIndex
};
```

**2. Conditional execution** - Wrap the execution block so it only runs when called directly:

```javascript
// Only run if executed directly (not when required by tests)
if (require.main === module) {
  try {
    generateBlogIndex();
    process.exit(0);
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}
```

### Why This Works

- When you run `npm run generate-index`, the script executes normally
- When tests import it with `require()`, functions are available but nothing auto-executes
- No duplication, no new files, minimal change to existing code
- The script remains a valid Node.js executable (`#!/usr/bin/env node`)

---

## Test Structure & Organization

### Test File Location

`scripts/__tests__/generate-blog-index.test.js`

This mirrors the frontend testing structure, keeping tests close to code.

### Test Organization

```javascript
// Unit Tests
describe('formatTitle', () => {
  // Happy path: basic slug conversion
  // Edge cases: single word, numbers, already capitalized
  // Special cases: empty string, dots in filename
});

// Integration Tests with Temp Filesystem
describe('findYearDirectories', () => {
  // Setup: create temp dir with 2024/, 2025/, invalid-dir/, file.txt
  // Test: finds only valid year directories
  // Test: returns empty array when no year dirs exist
  // Test: handles permission errors gracefully
  // Cleanup: remove temp directory
});

describe('findBlogPosts', () => {
  // Setup: create temp year dir with valid/invalid blog files
  // Test: finds only correctly named blog posts
  // Test: extracts date, title, slug correctly
  // Test: ignores non-blog markdown files
  // Test: handles empty directories
  // Cleanup: remove temp directory
});

describe('generateBlogIndex', () => {
  // Setup: full directory structure (multiple years, multiple posts)
  // Test: generates correct JSON with all posts
  // Test: sorts posts by date (newest first)
  // Test: creates empty array when no posts exist
  // Test: handles mixed valid/invalid files
  // Cleanup: remove temp directory and generated JSON
});
```

### Test Helpers

Helper functions to create and cleanup test fixtures:

- `createTempDir()` - Creates isolated temp directory for each test
- `createBlogPost(year, filename)` - Helper to create dummy markdown files
- `cleanupTempDir(path)` - Removes temp files after test

---

## Jest Configuration

### Extending Frontend's Jest Config

Currently, Jest is configured in the frontend directory. We'll extend it to discover and run tests in the `scripts/` directory.

### Configuration Changes

1. **Check current config location** - Identify if Jest config is in `frontend/package.json` or a separate config file

2. **Update test pattern** - Modify the Jest config to look for tests in both locations:
   ```javascript
   {
     "testMatch": [
       "<rootDir>/src/**/__tests__/**/*.js",
       "<rootDir>/../scripts/**/__tests__/**/*.js"
     ]
   }
   ```

3. **Update root paths** - Ensure Jest can resolve modules from both frontend and scripts:
   ```javascript
   {
     "roots": [
       "<rootDir>/src",
       "<rootDir>/../scripts"
     ]
   }
   ```

4. **Unified test command** - `npm test` from root or frontend now runs all tests (frontend components + build scripts)

### Benefits

- Single test command runs everything
- Unified coverage reports
- Same testing tools and patterns everywhere

---

## Coverage Goals & Success Criteria

### Coverage Targets

Following the same philosophy as frontend tests:

- **Pure functions** (`formatTitle`): 100% coverage - it's a pure function with no I/O, easy to test exhaustively
- **File system functions** (`findYearDirectories`, `findBlogPosts`): 90%+ coverage - test happy paths and common error cases
- **Main orchestration** (`generateBlogIndex`): 80%+ coverage - focus on integration scenarios that matter

### Definition of Done

1. ✅ Script refactored with exports and conditional execution
2. ✅ All test cases written and passing
3. ✅ Jest config updated to run script tests
4. ✅ Coverage meets targets (visible in `npm run test:coverage`)
5. ✅ Tests run in CI alongside frontend tests (already configured)
6. ✅ Documentation updated - add script testing to README

### Error Scenarios to Cover

- Missing `frontend/public/` directory
- No year directories found
- Year directories exist but no blog posts
- Malformed filenames (missing date, wrong pattern)
- File system permission errors (readable via try-catch in code)

### Test Execution

- `npm test` runs all tests (frontend + scripts)
- `npm run test:coverage` shows unified coverage report
- Individual test file can be run: `npm test generate-blog-index`

---

## Implementation Notes

### Testing Philosophy

- Keep tests simple and readable
- Use real file system for integration tests (not mocks) for higher confidence
- Clean up all temporary files in `afterEach` hooks
- Each test should be independent and able to run in isolation

### Maintenance

- When adding new functions to the script, export them and add corresponding tests
- When modifying file naming conventions, update test fixtures accordingly
- Keep test helpers DRY to avoid duplication in setup/teardown code
