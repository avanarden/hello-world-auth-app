# Spec 04: Blog Styling Consistency

## Overview

Update the blog's visual styling (fonts and colors) to match the main static site at https://vanarden.ca while keeping the current layout intact. The goal is to create a cohesive visual identity across both properties by updating typography and color scheme only, without changing the existing layout, spacing, or link colors.

## User Stories

### US-1: Professional Visual Consistency
**As a** site visitor
**I want** the blog to have the same professional, clean aesthetic as the main site
**So that** I experience a cohesive brand identity across all properties

**Acceptance Criteria:**
- Blog uses similar typography as main site
- Blog color scheme matches main site's minimalist palette
- Current blog layout (800px max-width, spacing, margins) is preserved
- Visual transition between main site and blog feels natural

### US-2: Improved Readability
**As a** blog reader
**I want** typography optimized for reading long-form content
**So that** I can comfortably read blog posts without strain

**Acceptance Criteria:**
- Font sizes are appropriate for body text and headings
- Line heights support comfortable reading
- Content width optimized for readability
- Text contrast meets accessibility standards

### US-3: Consistent Header Styling
**As a** site visitor
**I want** a header that aligns with the main site's aesthetic while maintaining distinct blog branding
**So that** I experience visual consistency while understanding I'm on the blog

**Acceptance Criteria:**
- Header styling is similar to main site but keeps "Alan's Blog" branding distinct
- Header uses colors that align with main site palette
- Header styling is simple and unobtrusive
- Header is responsive on mobile devices

## Functional Requirements

### Unit 1: Typography Updates

**FR1.1**: Body text uses professional sans-serif font stack consistent with main site
- Keep system fonts for cross-platform consistency
- Maintain current font stack or refine to match main site more closely

**FR1.2**: Heading fonts use appropriate weights and sizing
- H1-H6 hierarchy is clear and consistent
- Font weights emphasize headings without being too heavy

**FR1.3**: Code fonts match main site while remaining monospace
- Update to main site's monospace font stack if different from current
- Maintain monospace for code blocks and inline code readability
- Inline code uses distinct styling consistent with main site

### Unit 2: Color Scheme Alignment

**FR2.1**: Background colors match main site's clean, light palette
- Primary background: white or near-white (#ffffff or #fafafa)
- Maintain current #fafafa or move to pure white based on main site

**FR2.2**: Text colors use dark gray/black for optimal contrast
- Primary text: dark gray (#333 or darker)
- Headings: darker shade (#282c34 or #222)
- Ensure WCAG AA contrast compliance

**FR2.3**: Link colors preserved from current styling
- Keep current link color #4a90e2 and existing hover effects
- Maintain current hover state transitions
- Links remain clearly distinguishable from body text

**FR2.4**: Accent colors support minimalist design
- Use sparingly for emphasis
- Maintain consistency across blog list and post views

### Unit 3: Header Styling Alignment

**FR3.1**: Header styling aligns with main site while maintaining distinct branding
- Analyze main site header colors and styling approach
- Apply similar color scheme to blog header
- Keep "Alan's Blog" branding distinct and recognizable

**FR3.2**: Header colors match main site palette
- Update header background and text colors to align with main site
- Ensure proper contrast for accessibility (WCAG AA compliance)
- Maintain visual distinction as the blog section

**FR3.3**: Header maintains responsive behavior
- Font sizes adjust appropriately on mobile (current behavior preserved)
- Padding scales for different screen sizes (current behavior preserved)

### Unit 4: Layout and Spacing Preservation

**FR4.1**: Current layout structure is preserved entirely
- Maintain existing 800px max-width for content
- Preserve current line length and readability optimization
- No changes to content width or max-width values

**FR4.2**: Current spacing and margins are preserved
- Maintain all existing padding values
- Preserve current margins between sections
- No changes to whitespace or spacing patterns

**FR4.3**: Current responsive breakpoints are preserved
- Maintain existing mobile breakpoint at 768px
- Preserve current responsive behavior and layout adaptations
- No changes to media query breakpoints or responsive logic

### Unit 5: Component-Specific Styling

**FR5.1**: Blog list styling updated to match new color scheme
- Update title colors to match new heading color scheme
- Preserve existing hover effects and link colors (#4a90e2)
- Maintain clear visual hierarchy

**FR5.2**: Blog post content styling updated
- Update all markdown content styling (headings, links, blockquotes)
- Maintain code block styling with minimal adjustments
- Update table, list, and other content element styling

**FR5.3**: Link styling preserved across all components
- Back link maintains current color (#4a90e2)
- Blog list links preserve current color scheme
- Content links keep current styling (#4a90e2)
- All hover states remain unchanged

## Technical Considerations

### Browser Compatibility
- Continue supporting modern browsers (Chrome, Firefox, Safari, Edge)
- Maintain existing CSS approach (no new dependencies)
- Test responsive behavior across screen sizes

### Performance
- No performance impact expected (CSS-only changes)
- Maintain current CSS file structure
- No additional HTTP requests

### Accessibility
- Maintain or improve WCAG AA compliance for text contrast
- Ensure link colors have sufficient contrast
- Preserve semantic HTML structure

### Maintainability
- Keep CSS organized and commented
- Group related styles together
- Use consistent naming conventions

## Assumptions

1. Main site uses professional sans-serif system fonts (to be matched)
2. Main site uses white or near-white background (#ffffff or similar)
3. Main site uses dark text (#282c34, #222, or similar) for high contrast
4. Main site header styling can be analyzed and adapted to blog
5. No JavaScript changes required (CSS-only updates)
6. Current blog functionality remains unchanged
7. Current blog layout (800px max-width, spacing, margins) is preserved
8. Current link colors (#4a90e2) and hover effects are preserved
9. System font stack is acceptable for cross-platform consistency

## Constraints

1. No new dependencies or libraries
2. Changes limited to `frontend/src/App.css`
3. No breaking changes to existing components
4. Must preserve current layout entirely (max-width, spacing, margins)
5. Must preserve current link colors (#4a90e2) and hover effects
6. Must maintain responsive design with current breakpoints
7. Must preserve markdown rendering functionality
8. Must maintain syntax highlighting for code blocks

## Repository Standards

Based on analysis of the repository:

1. **CSS Organization**: Single `App.css` file with clear section comments
2. **Responsive Design**: Mobile-first approach with `@media` queries at 768px breakpoint
3. **Color Variables**: Direct hex values in CSS (no CSS variables currently used)
4. **Font Stack**: System fonts for cross-platform consistency
5. **Git Commits**: Conventional commit format with spec/task references
6. **Testing Approach**: Manual browser testing (no automated CSS tests)
7. **Quality Gates**: Visual verification in browser, console error checking

## Demoable Units

### Unit 1: Typography Updates
**Demo:** Navigate to blog and observe updated fonts matching main site across headings, body text, and code blocks (blog list and post views)

### Unit 2: Color Scheme Updates
**Demo:** View updated background colors, text colors, and heading colors matching main site palette; verify link colors remain #4a90e2

### Unit 3: Header Styling Alignment
**Demo:** View updated header with colors aligning to main site while maintaining "Alan's Blog" branding distinction; verify responsive behavior preserved

## Out of Scope

1. Fetching exact font families or hex codes from main site source code
2. Adding new CSS frameworks or preprocessors
3. Restructuring component architecture
4. Changing layout dimensions (max-width, spacing, margins, padding)
5. Modifying link colors or hover effects (preserving #4a90e2)
6. Changing responsive breakpoints or media query logic
7. Adding animations or transitions beyond current hover effects
8. Changing blog functionality or behavior
9. Updating markdown rendering approach
10. Modifying syntax highlighting themes

## Success Metrics

1. Typography consistency: Blog fonts match main site typography
2. Color consistency: Blog color scheme matches main site palette
3. Header alignment: Header colors align with main site while keeping distinct branding
4. Accessibility: Text contrast meets WCAG AA standards
5. Layout preservation: Current layout (800px max-width, spacing, margins) unchanged
6. Link preservation: Current link colors (#4a90e2) and hover effects unchanged
7. User acceptance: Visual transition between main site and blog feels natural

## Related Work

- Spec 01: Static blog site implementation (completed)
- Spec 02: Automatic blog post discovery (completed)
- Spec 03: Proper application naming (completed)

## Next Steps

After this spec is approved:
1. Run `/generate-task-list-from-spec` to create implementation tasks
2. Execute tasks following SDD workflow
3. Validate implementation with `/validate-spec-implementation`
4. Test in multiple browsers and screen sizes
5. Deploy updated styling to production

---

**Spec Created:** 2025-12-29
**Spec Author:** Claude Sonnet 4.5
**Target Implementation:** Blog styling update (CSS-only)
