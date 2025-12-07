# Accessibility Implementation Guide

## WCAG 2.1 AA Compliance Checklist

### Perceivable
- [x] **Text Alternatives**: All images have appropriate alt text
- [x] **Captions and Alternatives**: Videos have captions, audio has transcripts
- [x] **Adaptable**: Content can be presented in different ways without losing meaning
- [x] **Distinguishable**: Make it easier for users to see and hear content

### Operable
- [x] **Keyboard Accessible**: All functionality available from keyboard
- [x] **Timing**: Users have enough time to read and use content
- [x] **Seizures**: Nothing flashes more than 3 times per second
- [x] **Navigable**: Users can navigate and find content

### Understandable
- [x] **Readable**: Text is readable and understandable
- [x] **Predictable**: Web pages appear and operate in predictable ways
- [x] **Input Assistance**: Users are helped to avoid and correct mistakes

### Robust
- [x] **Compatible**: Content works with assistive technologies

## Implementation Guidelines

### 1. Semantic HTML
```tsx
// Good
<nav role="navigation">
  <ul>
    <li><a href="/products">Products</a></li>
  </ul>
</nav>

<main role="main">
  <h1>Page Title</h1>
  <article>
    <h2>Section Title</h2>
    <p>Content...</p>
  </article>
</main>
```

### 2. ARIA Labels and Roles
```tsx
// For interactive elements
<button 
  aria-label="Add product to cart"
  aria-describedby="product-price"
>
  Add to Cart
</button>

// For form inputs
<label htmlFor="email">Email Address</label>
<input 
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-help"
/>
<div id="email-help">We'll never share your email</div>
```

### 3. Color Contrast
- Text: Minimum 4.5:1 ratio for normal text
- Large text: Minimum 3:1 ratio for large text (18pt+ or 14pt+ bold)
- Non-text: Minimum 3:1 for UI components and graphics

### 4. Keyboard Navigation
```css
/* Focus indicators */
:focus {
  outline: 2px solid #007acc;
  outline-offset: 2px;
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### 5. Form Accessibility
```tsx
<form>
  <fieldset>
    <legend>Shipping Information</legend>
    
    <div className="form-group">
      <label htmlFor="fullName" className="required">
        Full Name
      </label>
      <input
        id="fullName"
        type="text"
        required
        aria-required="true"
        aria-describedby="name-error"
      />
      <div id="name-error" role="alert" aria-live="polite">
        {/* Error message appears here */}
      </div>
    </div>
  </fieldset>
</form>
```

### 6. Loading States
```tsx
<div role="status" aria-live="polite" aria-label="Loading products">
  {isLoading && <span className="sr-only">Loading...</span>}
  <div aria-hidden={!isLoading}>Loading...</div>
</div>
```

## Testing Tools
1. **Automated**: axe-core, Pa11y, Lighthouse
2. **Manual**: Screen readers, keyboard navigation, color contrast tools
3. **User testing**: Test with actual users who use assistive technologies

## Screen Reader Testing
- Test with NVDA (Windows), JAWS (Windows), VoiceOver (Mac)
- Ensure content is announced in logical order
- Verify interactive elements are properly labeled
- Check that dynamic content updates are announced