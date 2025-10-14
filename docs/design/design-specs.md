# Visual Design Specifications

## Color Palette

### Chart Colors (8 distinct, colorblind-friendly):

- **Primary**: #3b82f6 (blue) - Main data series
- **Secondary**: #10b981 (green) - Secondary data series
- **Tertiary**: #f59e0b (orange) - Tertiary data series
- **Quaternary**: #8b5cf6 (purple) - Quaternary data series
- **Quinary**: #ef4444 (red) - Quinary data series
- **Senary**: #06b6d4 (cyan) - Senary data series
- **Septenary**: #f97316 (dark orange) - Septenary data series
- **Octonary**: #ec4899 (pink) - Octonary data series

### Status Colors:

- **Success**: #10b981 (green) - Positive outcomes, achievements
- **Warning**: #f59e0b (amber) - Caution, attention needed
- **Error**: #ef4444 (red) - Errors, negative outcomes
- **Info**: #3b82f6 (blue) - Information, neutral states

### Neutral Colors:

- **Background**: #ffffff (white) - Primary background
- **Surface**: #f8fafc (light gray) - Card backgrounds
- **Border**: #e2e8f0 (gray) - Borders and dividers
- **Text Primary**: #1e293b (dark gray) - Primary text
- **Text Secondary**: #64748b (medium gray) - Secondary text
- **Text Muted**: #94a3b8 (light gray) - Muted text

### Dark Mode Colors:

- **Background**: #0f172a (dark blue) - Primary background
- **Surface**: #1e293b (dark gray) - Card backgrounds
- **Border**: #334155 (medium gray) - Borders and dividers
- **Text Primary**: #f1f5f9 (light gray) - Primary text
- **Text Secondary**: #cbd5e1 (medium gray) - Secondary text
- **Text Muted**: #64748b (light gray) - Muted text

## Typography

### Font Stack:

- **Primary**: System font stack (San Francisco, Segoe UI, Roboto, sans-serif)
- **Monospace**: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace
- **Fallback**: sans-serif, monospace

### Font Sizes:

- **Display Large**: 3.75rem (60px) - Hero headings
- **Display Medium**: 3rem (48px) - Page headings
- **Display Small**: 2.25rem (36px) - Section headings
- **Heading Large**: 1.875rem (30px) - Card headings
- **Heading Medium**: 1.5rem (24px) - Subsection headings
- **Heading Small**: 1.25rem (20px) - Small headings
- **Body Large**: 1.125rem (18px) - Large body text
- **Body Medium**: 1rem (16px) - Regular body text
- **Body Small**: 0.875rem (14px) - Small body text
- **Caption**: 0.75rem (12px) - Captions and labels

### Font Weights:

- **Light**: 300 - Light text
- **Regular**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Headings
- **Bold**: 700 - Strong emphasis

### Line Heights:

- **Tight**: 1.25 - Headings
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Large text

### Letter Spacing:

- **Tight**: -0.025em - Headings
- **Normal**: 0 - Body text
- **Wide**: 0.025em - Small caps

## Chart Design Standards

### Dimensions:

- **Default**: 800x450px (16:9 aspect ratio)
- **Mobile**: 400x225px (16:9 aspect ratio)
- **Tablet**: 600x338px (16:9 aspect ratio)
- **Large**: 1000x563px (16:9 aspect ratio)

### Grid Lines:

- **Color**: #e5e7eb (light gray)
- **Width**: 1px
- **Style**: Dashed
- **Opacity**: 0.5

### Axis Lines:

- **Color**: #9ca3af (medium gray)
- **Width**: 1px
- **Style**: Solid
- **Opacity**: 1

### Legend:

- **Position**: Bottom or right
- **Font Size**: 12px
- **Font Weight**: 500
- **Spacing**: 16px between items
- **Icons**: 8px squares

### Tooltips:

- **Background**: #ffffff (white)
- **Border**: #e2e8f0 (gray)
- **Border Radius**: 6px
- **Padding**: 12px
- **Shadow**: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- **Font Size**: 14px
- **Max Width**: 200px

### Interactive States:

- **Hover**: Scale 1.02, transition 0.2s
- **Active**: Scale 0.98, transition 0.1s
- **Focus**: 2px outline, #3b82f6 color
- **Disabled**: 0.5 opacity, no interaction

## Responsive Breakpoints

### Mobile: < 640px

- **Layout**: Single column
- **Charts**: Simplified, stacked
- **Navigation**: Bottom navigation
- **Touch Targets**: Minimum 44px
- **Font Sizes**: Reduced by 10%

### Tablet: 640px - 1024px

- **Layout**: Two columns
- **Charts**: Full charts
- **Navigation**: Side navigation
- **Touch Targets**: Minimum 40px
- **Font Sizes**: Standard

### Desktop: > 1024px

- **Layout**: Three columns
- **Charts**: Full charts with all features
- **Navigation**: Top navigation
- **Touch Targets**: Minimum 36px
- **Font Sizes**: Standard

### Large Desktop: > 1440px

- **Layout**: Four columns
- **Charts**: Large charts
- **Navigation**: Top navigation with sidebar
- **Touch Targets**: Standard
- **Font Sizes**: Standard

## Component Styling

### Cards:

- **Background**: #ffffff (white)
- **Border**: 1px solid #e2e8f0 (gray)
- **Border Radius**: 8px
- **Padding**: 24px
- **Shadow**: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
- **Hover**: Shadow 0 4px 6px -1px rgba(0, 0, 0, 0.1)

### Buttons:

- **Primary**: #3b82f6 background, #ffffff text
- **Secondary**: #f1f5f9 background, #1e293b text
- **Danger**: #ef4444 background, #ffffff text
- **Border Radius**: 6px
- **Padding**: 12px 24px
- **Font Weight**: 500
- **Hover**: Darker shade, transition 0.2s

### Form Inputs:

- **Background**: #ffffff (white)
- **Border**: 1px solid #d1d5db (gray)
- **Border Radius**: 6px
- **Padding**: 12px 16px
- **Font Size**: 16px
- **Focus**: Border #3b82f6, shadow 0 0 0 3px rgba(59, 130, 246, 0.1)

### Tables:

- **Header**: #f8fafc background, #1e293b text
- **Rows**: Alternating #ffffff and #f8fafc
- **Borders**: #e2e8f0
- **Padding**: 12px 16px
- **Font Size**: 14px

### Modals:

- **Background**: rgba(0, 0, 0, 0.5)
- **Content**: #ffffff background
- **Border Radius**: 8px
- **Padding**: 24px
- **Max Width**: 500px
- **Shadow**: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

## Animations

### Chart Animations:

- **Entrance**: Fade in + draw (0.8s ease-out)
- **Data Updates**: Smooth transitions (0.3s)
- **Hover**: Scale 1.02, transition 0.2s
- **Click**: Scale 0.98, transition 0.1s

### Page Transitions:

- **Fade In**: 0.3s ease-out
- **Slide In**: 0.4s ease-out
- **Scale In**: 0.3s ease-out
- **Stagger**: 0.1s delay between items

### Loading States:

- **Skeleton**: Pulse animation (1.5s infinite)
- **Spinner**: Rotate animation (1s infinite)
- **Progress Bar**: Width animation (0.5s ease-out)
- **Shimmer**: Gradient animation (2s infinite)

### Success States:

- **Confetti**: Particle animation (2s)
- **Checkmark**: Draw animation (0.5s)
- **Bounce**: Scale animation (0.6s)
- **Glow**: Box shadow animation (1s)

### Hover Effects:

- **Scale**: 1.02 scale, transition 0.2s
- **Shadow**: Increased shadow, transition 0.2s
- **Color**: Slight color change, transition 0.2s
- **Border**: Border color change, transition 0.2s

## Accessibility

### Color Contrast:

- **Normal Text**: 4.5:1 contrast ratio minimum
- **Large Text**: 3:1 contrast ratio minimum
- **UI Elements**: 3:1 contrast ratio minimum
- **Focus Indicators**: 3:1 contrast ratio minimum

### Focus Indicators:

- **Outline**: 2px solid #3b82f6
- **Offset**: 2px from element
- **Radius**: 4px
- **Transition**: 0.2s ease-out

### Screen Reader Support:

- **ARIA Labels**: All interactive elements
- **Live Regions**: Dynamic content updates
- **Table Headers**: Proper table structure
- **Form Labels**: Associated with inputs

### Keyboard Navigation:

- **Tab Order**: Logical sequence
- **Skip Links**: Jump to main content
- **Keyboard Shortcuts**: Common actions
- **Focus Management**: Trap focus in modals

## Dark Mode

### Color Adjustments:

- **Backgrounds**: Darker shades
- **Text**: Lighter shades
- **Borders**: Adjusted contrast
- **Charts**: Inverted colors
- **Shadows**: Adjusted opacity

### Dark Mode Colors:

- **Primary**: #3b82f6 (same)
- **Secondary**: #10b981 (same)
- **Background**: #0f172a
- **Surface**: #1e293b
- **Text**: #f1f5f9
- **Border**: #334155

### Chart Adjustments:

- **Grid Lines**: #374151
- **Axis Lines**: #6b7280
- **Tooltips**: #1f2937 background
- **Legends**: Adjusted contrast

## Print Styles

### Print Optimizations:

- **Background**: White
- **Text**: Black
- **Charts**: High contrast
- **Layout**: Single column
- **Page Breaks**: Logical breaks
- **Margins**: 0.5 inch

### Print-Specific Styles:

```css
@media print {
  .no-print {
    display: none;
  }
  .print-break {
    page-break-before: always;
  }
  .print-avoid-break {
    page-break-inside: avoid;
  }
  .print-full-width {
    width: 100%;
  }
}
```

## Performance Considerations

### Image Optimization:

- **Format**: WebP with JPEG fallback
- **Compression**: 80% quality
- **Sizing**: Responsive images
- **Lazy Loading**: Below fold images

### Font Loading:

- **Preload**: Critical fonts
- **Fallback**: System fonts
- **Display**: Swap
- **Subset**: Character subsets

### Animation Performance:

- **Transform**: Use transform instead of position
- **Opacity**: Use opacity for fade effects
- **Will-Change**: Hint browser for animations
- **Reduce Motion**: Respect user preferences

## Browser Support

### Modern Browsers:

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Fallbacks:

- **CSS Grid**: Flexbox fallback
- **CSS Custom Properties**: Static values
- **Modern JavaScript**: Polyfills
- **WebP**: JPEG fallback

## Design System

### Spacing Scale:

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### Border Radius Scale:

- **sm**: 4px
- **md**: 6px
- **lg**: 8px
- **xl**: 12px
- **2xl**: 16px
- **full**: 9999px

### Shadow Scale:

- **sm**: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- **md**: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- **lg**: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
- **xl**: 0 20px 25px -5px rgba(0, 0, 0, 0.1)

### Z-Index Scale:

- **dropdown**: 1000
- **sticky**: 1020
- **fixed**: 1030
- **modal-backdrop**: 1040
- **modal**: 1050
- **popover**: 1060
- **tooltip**: 1070
