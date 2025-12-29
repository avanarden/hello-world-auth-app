# S3 Bucket Structure and Configuration Example

This document provides a complete guide for deploying Alan's Blog to Amazon S3 as a static website.

## S3 Bucket Structure

Your S3 bucket should have the following file structure after deployment:

```
my-blog-bucket/
├── index.html                 # Main entry point (from build/)
├── favicon.ico               # Site favicon (if present)
├── manifest.json             # Web app manifest (if present)
├── blog-index.json           # Blog metadata index
├── static/
│   ├── css/
│   │   ├── main.[hash].css
│   │   └── main.[hash].css.map
│   └── js/
│       ├── main.[hash].js
│       ├── main.[hash].js.map
│       └── [other bundled files]
└── 2024/
    ├── blog-2024-01-15-sample-post.md
    ├── blog-2024-03-20-another-post.md
    └── blog-2024-06-10-third-post.md
```

## File Naming Conventions

### Blog Post Files

Blog post markdown files must follow this naming pattern:

```
YYYY/blog-YYYY-MM-DD-title-slug.md
```

**Examples:**
- `2024/blog-2024-01-15-sample-post.md`
- `2024/blog-2024-12-25-holiday-special.md`
- `2025/blog-2025-02-14-new-year-updates.md`

**Rules:**
- Year directory must match the date in the filename
- Date format: `YYYY-MM-DD`
- Title slug: lowercase, hyphen-separated words
- File extension: `.md`

### Blog Index File

The blog index file must be named `blog-index.json` and placed at the root of the bucket.

## blog-index.json Format

The blog index file is a JSON array of blog post metadata objects.

### Schema

```json
[
  {
    "slug": "string",      // Unique identifier, matches filename pattern YYYY-MM-DD-title
    "title": "string",     // Display title for the post
    "date": "string",      // ISO date format YYYY-MM-DD
    "path": "string"       // Relative path to markdown file from bucket root
  }
]
```

### Complete Example

```json
[
  {
    "slug": "2024-06-10-third-post",
    "title": "Third Post",
    "date": "2024-06-10",
    "path": "/2024/blog-2024-06-10-third-post.md"
  },
  {
    "slug": "2024-03-20-another-post",
    "title": "Another Post",
    "date": "2024-03-20",
    "path": "/2024/blog-2024-03-20-another-post.md"
  },
  {
    "slug": "2024-01-15-sample-post",
    "title": "Sample Post",
    "date": "2024-01-15",
    "path": "/2024/blog-2024-01-15-sample-post.md"
  }
]
```

**Important Notes:**
- Posts are displayed in reverse chronological order (newest first) on the site
- The `slug` field is used in the URL: `/blog/:slug`
- The `path` field must point to the actual markdown file location in S3
- All paths should start with `/` for consistency

## Static Website Hosting Settings

Configure your S3 bucket for static website hosting with these settings:

### 1. Enable Static Website Hosting

In the AWS S3 Console:
1. Select your bucket
2. Go to **Properties** tab
3. Scroll to **Static website hosting**
4. Click **Edit**
5. Select **Enable**
6. Configure:
   - **Index document**: `index.html`
   - **Error document**: `index.html` (for client-side routing)
7. Save changes

### 2. Bucket Policy for Public Read Access

Add this bucket policy to allow public read access to your blog content:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

**Replace `YOUR-BUCKET-NAME` with your actual bucket name.**

### 3. Block Public Access Settings

Ensure these settings are configured:
- **Block all public access**: OFF (uncheck)
  - Block public access to buckets and objects granted through new access control lists (ACLs): OFF
  - Block public access to buckets and objects granted through any access control lists (ACLs): OFF
  - Block public access to buckets and objects granted through new public bucket or access point policies: OFF
  - Block public and cross-account access to buckets and objects through any public bucket or access point policies: OFF

## CORS Configuration

CORS (Cross-Origin Resource Sharing) configuration is **not required** for this static blog because:
- All resources are served from the same origin (your S3 bucket)
- The blog fetches markdown files and JSON from relative paths
- No external API calls or cross-origin requests are made

If you later add features that require CORS (e.g., API integrations), you can add a CORS configuration in the S3 bucket **Permissions** tab.

## Deployment Process

### Option 1: AWS Console Upload

1. Run production build locally:
   ```bash
   cd frontend
   npm run build
   ```

2. Upload build contents to S3:
   - Upload all files from `frontend/build/` to bucket root
   - Ensure `blog-index.json` is at bucket root
   - Ensure year directories (e.g., `2024/`) with markdown files are uploaded

3. Set file permissions:
   - All files should have public-read ACL

### Option 2: AWS CLI

```bash
# Build the application
cd frontend
npm run build
cd ..

# Sync build directory to S3
aws s3 sync frontend/build/ s3://YOUR-BUCKET-NAME/ --acl public-read

# Verify upload
aws s3 ls s3://YOUR-BUCKET-NAME/ --recursive
```

### Option 3: CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy to S3

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: cd frontend && npm install

      - name: Build
        run: cd frontend && npm run build

      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --acl public-read --follow-symlinks --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'us-east-1'
          SOURCE_DIR: 'frontend/build'
```

## Adding New Blog Posts

To add a new blog post:

1. **Create markdown file** in appropriate year directory:
   ```bash
   # Example for a post on March 15, 2025
   touch frontend/public/2025/blog-2025-03-15-my-new-post.md
   ```

2. **Write your content** using GitHub-flavored markdown

3. **Update blog-index.json**:
   ```json
   {
     "slug": "2025-03-15-my-new-post",
     "title": "My New Post",
     "date": "2025-03-15",
     "path": "/2025/blog-2025-03-15-my-new-post.md"
   }
   ```
   Add this entry to the beginning of the array for newest posts first

4. **Test locally**:
   ```bash
   cd frontend
   npm start
   ```

5. **Build and deploy**:
   ```bash
   npm run build
   # Then deploy using your chosen method
   ```

## Accessing Your Blog

After deployment, your blog will be available at:

```
http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com
```

Example:
```
http://alans-blog.s3-website-us-east-1.amazonaws.com
```

### Optional: Custom Domain

To use a custom domain (e.g., `blog.example.com`):

1. Register domain in Route 53 or external registrar
2. Create S3 bucket with exact domain name: `blog.example.com`
3. Configure static website hosting
4. Create Route 53 alias record pointing to S3 website endpoint
5. (Optional) Add CloudFront for HTTPS support

## Troubleshooting

### Issue: "Access Denied" when accessing blog

**Solution:**
- Check bucket policy allows public read access
- Verify Block Public Access settings are disabled
- Ensure files have public-read ACL

### Issue: 404 errors for blog routes

**Solution:**
- Verify Error document is set to `index.html` in static website hosting settings
- This enables client-side routing to work properly

### Issue: Blog posts not loading

**Solution:**
- Check `blog-index.json` is at bucket root and publicly accessible
- Verify markdown files exist at paths specified in `blog-index.json`
- Check browser console for network errors

### Issue: Styles not loading

**Solution:**
- Verify all files from `frontend/build/static/` are uploaded to S3
- Check file paths in deployed `index.html` match S3 structure
- Ensure CSS files have public-read permissions

## Security Considerations

- **No sensitive data**: This is a public blog; never include API keys, credentials, or private information in blog posts or configuration
- **Public access**: All content is publicly readable; this is intentional for a blog
- **No authentication**: The blog has no login or admin interface; all content management is done via file uploads
- **Static content only**: No server-side code execution; all content is pre-rendered static HTML/JS/CSS

## Cost Estimation

Typical monthly costs for a small blog (< 10,000 visitors/month):

- **S3 Storage**: ~$0.10 - $1.00 (depends on number of posts and images)
- **S3 Data Transfer**: ~$0.50 - $5.00 (depends on traffic)
- **Total**: < $10/month for most small blogs

For higher traffic, consider adding CloudFront CDN for better performance and lower costs.
