# GitHub Repository Renaming Guide

This guide provides step-by-step instructions for renaming the GitHub repository from `hello-world-auth-app` to `blog-app` to align with the updated package naming.

## Overview

The current repository is named `hello-world-auth-app`, but the codebase has been updated to use `blog-app` naming. This guide will help you rename the repository on GitHub and update your local configuration.

---

## GitHub UI Steps for Renaming Repository

Follow these steps to rename your repository on GitHub:

### Step 1: Navigate to Repository Settings

1. Go to your repository on GitHub: `https://github.com/avanarden/hello-world-auth-app`
2. Click on the **Settings** tab (near the top right of the repository page)

### Step 2: Rename the Repository

1. In the Settings page, scroll down to the **Repository name** section (usually near the top)
2. You will see the current repository name: `hello-world-auth-app`
3. Click in the text field and change the name to: `blog-app`
4. Click the **Rename** button to confirm

### Step 3: Confirm the Rename

1. GitHub will display a warning dialog explaining the implications of renaming
2. Read the warning carefully - it mentions that:
   - GitHub will automatically redirect from the old URL to the new URL
   - You'll need to update local clones
   - You'll need to update any references to the old repository name
3. Click **I understand, rename this repository** to proceed

### Important Notes

- **You must have admin permissions** on the repository to rename it
- The rename takes effect immediately
- GitHub automatically creates redirects from the old repository URL to the new one

---

## Implications of Repository Renaming

Understanding what happens when you rename a repository is important for a smooth transition:

### URL Changes

**Old Repository URL:**
```
https://github.com/avanarden/hello-world-auth-app
git@github.com:avanarden/hello-world-auth-app.git
```

**New Repository URL:**
```
https://github.com/avanarden/blog-app
git@github.com:avanarden/blog-app.git
```

### Automatic Redirects

GitHub provides automatic redirects to help with the transition:

- **Web Browser**: Visiting the old URL (`https://github.com/avanarden/hello-world-auth-app`) will automatically redirect to the new URL (`https://github.com/avanarden/blog-app`)
- **Git Operations**: Git fetch, pull, and push operations to the old URL will continue to work due to redirects
- **Duration**: These redirects are permanent and will continue indefinitely

### What Needs Updating

While redirects work, it's best practice to update references to use the new repository name:

1. **Local Git Remotes**: Update the remote URL in your local clones (see next section)
2. **CI/CD Pipelines**: Update any continuous integration or deployment configurations
3. **Documentation**: Update README files, wikis, or other documentation that references the repository URL
4. **External Links**: Update links in blog posts, presentations, or other external references
5. **Webhooks**: Repository webhooks will continue to work, but review and update if needed
6. **GitHub Actions**: Workflow files that reference the repository should be reviewed

### What Continues to Work

The following will continue to work without any action required:

- ✅ **Existing Clones**: Your existing local clones will continue to work via redirects
- ✅ **Issues and Pull Requests**: All issues and PRs remain intact with their original numbers
- ✅ **Git History**: Complete commit history is preserved
- ✅ **Branches and Tags**: All branches and tags remain unchanged
- ✅ **Stars and Watchers**: Repository stars and watchers are preserved
- ✅ **Collaborators**: All collaborator permissions remain the same

---

## Updating Local Git Remote URLs

While GitHub redirects will continue to work, it's best practice to update your local repository's remote URL to point to the new repository name.

### Step 1: Check Current Remote URL

First, verify your current remote configuration:

```bash
git remote -v
```

**Expected output:**
```
origin	git@github.com:avanarden/hello-world-auth-app.git (fetch)
origin	git@github.com:avanarden/hello-world-auth-app.git (push)
```

### Step 2: Update Remote URL

Update the remote URL to use the new repository name:

**For SSH URLs:**
```bash
git remote set-url origin git@github.com:avanarden/blog-app.git
```

**For HTTPS URLs:**
```bash
git remote set-url origin https://github.com/avanarden/blog-app.git
```

### Step 3: Verify the Update

Confirm the remote URL has been updated:

```bash
git remote -v
```

**Expected output:**
```
origin	git@github.com:avanarden/blog-app.git (fetch)
origin	git@github.com:avanarden/blog-app.git (push)
```

### Alternative: Manual Configuration

You can also manually edit the `.git/config` file:

```bash
# Open the config file in your editor
nano .git/config
```

Find the `[remote "origin"]` section and update the URL:

```ini
[remote "origin"]
    url = git@github.com:avanarden/blog-app.git
    fetch = +refs/heads/*:refs/remotes/origin/*
```

### For Multiple Local Clones

If you have multiple clones of this repository on your system, repeat the update process for each clone:

1. Navigate to each clone directory
2. Run `git remote set-url origin git@github.com:avanarden/blog-app.git`
3. Verify with `git remote -v`

---

## Verification Steps

After completing the repository rename on GitHub and updating your local configuration, verify that everything is working correctly:

### 1. Verify GitHub Repository Name

**Check via Web Browser:**
1. Navigate to `https://github.com/avanarden/blog-app`
2. Confirm the repository name shows as `blog-app` in the header
3. Verify the old URL (`https://github.com/avanarden/hello-world-auth-app`) redirects to the new URL

**Expected Result:** ✅ Repository displays with new name, old URL redirects successfully

### 2. Verify Local Remote Configuration

**Check your local repository:**
```bash
git remote -v
```

**Expected output:**
```
origin	git@github.com:avanarden/blog-app.git (fetch)
origin	git@github.com:avanarden/blog-app.git (push)
```

**Expected Result:** ✅ Remote URLs show `blog-app` instead of `hello-world-auth-app`

### 3. Test Git Operations

**Perform a test fetch:**
```bash
git fetch origin
```

**Expected output:**
```
From github.com:avanarden/blog-app
 * branch            main       -> FETCH_HEAD
```

**Expected Result:** ✅ Fetch succeeds using new repository name

**Perform a test pull (if on main branch):**
```bash
git pull origin main
```

**Expected Result:** ✅ Pull operation completes successfully

### 4. Verify Repository Contents

**Check that all content is intact:**
```bash
git log --oneline -5
git branch -a
git tag
```

**Expected Results:**
- ✅ Commit history is complete and unchanged
- ✅ All branches are present
- ✅ All tags are present

### 5. Test Push Operation (Optional)

**Note:** Only do this if you have uncommitted changes or want to verify push access.

```bash
# Make a trivial change (optional)
echo "# Repository renamed to blog-app" >> .github/RENAME_NOTE.md
git add .github/RENAME_NOTE.md
git commit -m "docs: note repository rename"
git push origin main
```

**Expected Result:** ✅ Push succeeds to new repository name

### Verification Checklist

Use this checklist to confirm the rename is complete:

- [ ] GitHub repository shows new name `blog-app`
- [ ] Old URL redirects to new URL in browser
- [ ] Local `git remote -v` shows new repository name
- [ ] `git fetch` works successfully
- [ ] `git pull` works successfully
- [ ] Commit history is intact
- [ ] All branches are present
- [ ] All tags are present
- [ ] (Optional) `git push` works successfully

---

## Summary

After completing this guide, you will have:

1. ✅ Renamed the GitHub repository from `hello-world-auth-app` to `blog-app`
2. ✅ Updated local git remote URLs to use the new repository name
3. ✅ Verified that all git operations work correctly with the new name
4. ✅ Confirmed that repository contents remain intact

The repository rename is now complete and aligned with the updated package naming in the codebase!
