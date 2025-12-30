# Blog Color Scheme Harmonization Design

**Date:** 2025-12-30
**Status:** Approved
**Approach:** Harmonized adaptation - adopt main site's warm gold/brown palette while maintaining blog readability

## Overview

Update the blog's color scheme to harmonize with the main site (vanarden.ca) by adopting its warm gold and brown accent palette. This creates brand cohesion while respecting that the blog is optimized for extended reading sessions.

## Design Principles

1. **Harmonized, not identical** - Adapt the main site's palette for blog-specific needs
2. **Strategic gold use** - Gold appears as deliberate accents, not overwhelming decoration
3. **Readability first** - Long-form content requires subtle, comfortable colors
4. **Consistent interactions** - All hover states use the same muted gold tone

## Color Palette

### Core Colors

| Element | Current | New | Rationale |
|---------|---------|-----|-----------|
| Body text | #2c2c2c | #222 | Match main site, slightly darker for readability |
| Background | #ffffff | #fff | Unchanged |
| Borders | #e0e0e0 | rgb(0 0 0/6%) | Match main site's subtle transparent borders |

### Accent Colors

| Purpose | Color | Hex/RGB |
|---------|-------|---------|
| Primary gold (borders, structure) | Brown-gold | #746c48 |
| Hover states | Muted gold-brown | #8f834f |
| CTAs and primary actions | Bright gold | #D4AF37 |
| Code/table backgrounds | Very light gray | #f7f7f7 |

### Semantic Colors

| Element | Color | Notes |
|---------|-------|-------|
| Error messages | #d32f2f | Unchanged - red is universal |
| Loading/empty states | #666 | Unchanged |
| Dates/metadata | #888 | Unchanged - good hierarchy |

## Typography & Headings

### Body Text
- Main content: #222
- Strong/bold: #222 (inherit, no override needed)
- Dates and metadata: #888

### Headings
- All heading text: #222
- H1 border-bottom: 2px solid #746c48 (gold)
- H2 border-bottom: 1px solid #746c48 (gold)
- H3-H6: No borders

### Header Area
- Site title: #1a1a1a (keep current)
- Header background: #fff
- Header border: rgb(0 0 0/6%) with optional gold accent consideration

## Links & Interactive Elements

### Primary Links
- Default: #222 (same as body text - subtle approach)
- Hover: #8f834f (muted gold-brown)
- Hover underline: border-bottom-color: #8f834f
- Transition: 0.2s ease (unchanged)

### Back Link ("← Back to posts")
- Default: #D4AF37 (bright gold - stands out as primary navigation)
- Hover: #8f834f (darker gold-brown)
- Underline on hover maintained

### Blog List Links
- Post titles default: #222
- Post titles hover: #8f834f
- translateX(5px) animation: Keep (nice touch!)
- Post dates: #888

### Accessibility
- Focus states: Add outline: 2px solid #D4AF37 for keyboard navigation

## Accent Elements

### Inline Code
- Background: #f7f7f7 (was #f8f8f8)
- Text: #222 (was #d63384 pink - now neutral)
- Border-radius: 3px
- Padding: 0.2rem 0.4rem

### Code Blocks
- Background: Syntax highlighter provides (unchanged)
- Let syntax highlighter handle internal coloring

### Blockquotes
- Border-left: 4px solid #746c48 (was #4a90e2 blue)
- Background: #f7f7f7 (was #f8f8f8)
- Text: #666 (unchanged)
- Italic maintained

### Tables
- Header background: #f7f7f7 (was #f8f8f8)
- Borders: rgb(0 0 0/6%) (was #ddd)
- Striped rows: #f7f7f7
- Header text: #222

### Horizontal Rules
- Default: rgb(0 0 0/6%) (was #e0e0e0)
- Optional: #746c48 for more prominent breaks

## Strategic Gold Highlights

### Structural Elements
- Blog post header border-bottom: 2px solid #746c48
- Blog post footer border-top: 1px solid #746c48 (optional)
- Blog list item separators: Keep subtle at rgb(0 0 0/6%)

### Visual Hierarchy
- **Bright gold (#D4AF37)**: Primary CTAs only (back link)
- **Brown-gold (#746c48)**: Structural accents (h1/h2 borders, blockquotes, dividers)
- **Muted gold (#8f834f)**: All hover states universally
- **Neutral grays**: Text, subtle borders, backgrounds

## Implementation Notes

### Scope
- All changes confined to `frontend/src/App.css`
- No structural HTML changes required
- No component logic changes needed
- Backward compatible with all existing content

### Color Replacements Summary
| Old Color | New Color | Usage |
|-----------|-----------|-------|
| #4a90e2 (blue) | #222 → #8f834f hover | Links |
| #357abd (dark blue) | #8f834f | Link hover |
| #d63384 (pink) | #222 | Inline code text |
| #e0e0e0 (gray) | rgb(0 0 0/6%) | Borders |
| #f8f8f8 | #f7f7f7 | Code/table backgrounds |
| #4a90e2 (blockquote) | #746c48 | Blockquote border |

### New Additions
- Back link: #D4AF37 default, #8f834f hover
- H1/H2 borders: #746c48
- Focus outlines: 2px solid #D4AF37
- Optional header accent: #746c48

## Design Goals Achieved

1. ✅ Brand cohesion with vanarden.ca
2. ✅ Maintains blog readability for long-form content
3. ✅ Sophisticated warm palette replaces cool blues
4. ✅ Strategic rather than overwhelming gold usage
5. ✅ Consistent interaction patterns (all hovers use #8f834f)
6. ✅ CSS-only changes (no structural modifications)

## Testing Checklist

- [ ] Verify link colors and hover states
- [ ] Check h1/h2 gold borders render correctly
- [ ] Confirm blockquote gold border appears
- [ ] Test inline code neutral styling
- [ ] Verify table borders and backgrounds
- [ ] Check back link gold color
- [ ] Test focus states for accessibility
- [ ] Review on mobile (responsive)
- [ ] Compare side-by-side with vanarden.ca for harmony

## Next Steps

1. Create implementation plan
2. Set up git worktree for isolated work
3. Update App.css with new color scheme
4. Test thoroughly in development
5. Build and verify production bundle
6. Deploy to S3
