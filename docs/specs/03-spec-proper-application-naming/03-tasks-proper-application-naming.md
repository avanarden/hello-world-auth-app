# 03-tasks-proper-application-naming.md

## Relevant Files

- `package.json` - Root package configuration that needs name and description updates
- `frontend/package.json` - Frontend package configuration that needs name update
- `docs/specs/03-spec-proper-application-naming/github-repository-rename.md` - New documentation file to be created with GitHub repository renaming instructions

### Notes

- No tests are required for this feature as it involves configuration file updates only
- Follow npm package naming conventions (lowercase, hyphens for word separation)
- Preserve all existing package.json structure, scripts, dependencies, and configuration
- The application uses React 18 with react-scripts 5.0.1 for the build system
- Development server runs on port 3000 with the app hosted at `/blog` path (configured via `homepage` field in frontend package.json)

## Tasks

### [~] T1.0 Update Package Configurations

#### T1.0 Proof Artifact(s)

- File content: Root `package.json` shows `"name": "blog-app"` and `"description": "A static blog site built with React"` demonstrates correct root package updates
- File content: `frontend/package.json` shows `"name": "blog-frontend"` demonstrates correct frontend package update
- CLI: `npm install` runs without errors demonstrates no broken dependencies after renaming

#### T1.0 Tasks

- [x] T1.1 Update root `package.json` name field from `"hello-world-app"` to `"blog-app"`
- [x] T1.2 Update root `package.json` description field to `"A static blog site built with React"`
- [x] T1.3 Update `frontend/package.json` name field from `"hello-world-frontend"` to `"blog-frontend"`
- [x] T1.4 Run `npm install` to verify no dependency issues after renaming

### [ ] T2.0 Verify Build and Runtime Functionality

#### T2.0 Proof Artifact(s)

- CLI: `npm install` completes successfully demonstrates dependency resolution works
- CLI: `npm run build` completes successfully demonstrates production build works
- CLI: `npm start` launches development server demonstrates development workflow works
- Screenshot: Browser console at http://localhost:3000/blog shows no errors demonstrates application runs correctly

#### T2.0 Tasks

- [ ] T2.1 Run `npm install` to ensure dependency resolution works correctly
- [ ] T2.2 Run `npm run build` to verify production build completes successfully
- [ ] T2.3 Run `npm start` to launch the development server
- [ ] T2.4 Navigate to http://localhost:3000/blog in browser and verify the application loads
- [ ] T2.5 Open browser developer console and verify no errors are present
- [ ] T2.6 Take screenshot of browser console showing no errors and save as proof artifact

### [ ] T3.0 Create GitHub Repository Renaming Documentation

#### T3.0 Proof Artifact(s)

- File content: `docs/specs/03-spec-proper-application-naming/github-repository-rename.md` contains complete renaming instructions demonstrates guidance is available
- Documentation: Instructions include GitHub UI steps and local git remote update commands demonstrates completeness of guidance

#### T3.0 Tasks

- [ ] T3.1 Create documentation file at `docs/specs/03-spec-proper-application-naming/github-repository-rename.md`
- [ ] T3.2 Document GitHub UI steps for renaming repository from `"hello-world-auth-app"` to `"blog-app"`
- [ ] T3.3 Document implications of repository renaming including URL changes and automatic redirects
- [ ] T3.4 Document commands for updating local git remote URLs after GitHub rename
- [ ] T3.5 Include verification steps to confirm the repository rename is complete
