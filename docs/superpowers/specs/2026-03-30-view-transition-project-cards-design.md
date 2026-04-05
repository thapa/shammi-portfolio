# View Transition API — Project Card → Modal

**Date:** 2026-03-30
**Status:** Approved

## Goal

When a project card is clicked, the card's screenshot thumbnail morphs smoothly into the modal's desktop screenshot using the native View Transition API (shared element transition). The modal overlay and body content fade in separately.

## Approach

Native View Transition API with `flushSync` for synchronous React DOM updates inside the transition callback. This avoids the name-collision problem (card and modal sharing the same `view-transition-name` in the same DOM snapshot) without needing refs or direct DOM manipulation.

## Name Collision — How It's Solved

The card stays in the DOM while the modal portal is open. Both would have the same `view-transition-name` in the "after" snapshot, which is invalid.

**Solution:** Conditionally apply the card's `view-transition-name` only when that card is NOT currently open. The `selected` prop passed to `ProjectCard` is the full selected project object (or `null`); comparison is by `id`:

```jsx
// Card's img — only assign the transition name when this card is not open
viewTransitionName: selected?.id !== p.id ? `project-img-${p.id}` : 'none'
```

Since `flushSync(() => setSelected(p))` updates `selected` synchronously before the browser takes its "after" snapshot, the card's name becomes `'none'` while the modal's image carries the name. No collision.

## Files Changed

### `src/components/global/home/Projects.jsx`

**1. `ScreenshotImage` component** — add an `imgStyle` prop spread onto the inner `<img>`:

```jsx
const ScreenshotImage = ({ src, loading, error, fallbackTitle, className = '', objectPosition = 'top', imgStyle }) => (
  <div ...>
    ...
    {!error && (
      <img
        ...
        style={{ objectPosition, ...imgStyle }}
      />
    )}
  </div>
)
```

Note: `objectPosition` moves from Tailwind class to inline style here since we're already using the `style` prop.

**2. `ProjectCard` component** — accept `selected` prop (full object or `null`); add an inline `style` prop to the screenshot `<img>` **alongside the existing Tailwind classes** (do not remove `object-cover`, `object-top`, or any other class — the inline style only adds `viewTransitionName`):

```jsx
const ProjectCard = ({ project: p, onClick, selected }) => {
  ...
  <img
    src={imgSrc ?? undefined}
    alt={p.title}
    loading="lazy"
    className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${imgSrc && !imgLoading ? 'opacity-100' : 'opacity-0'}`}
    style={{ viewTransitionName: selected?.id !== p.id ? `project-img-${p.id}` : 'none' }}
  />
}
```

**3. `ProjectModal` component** — pass `imgStyle` with the `viewTransitionName` to the desktop `ScreenshotImage`:

```jsx
<ScreenshotImage
  src={desktopSrc}
  loading={desktopLoading}
  error={desktopError}
  fallbackTitle={p.title}
  className="w-full aspect-video rounded-xl border border-neutral-100 dark:border-neutral-800"
  objectPosition="top"
  imgStyle={{ viewTransitionName: `project-img-${p.id}` }}
/>
```

**4. `Projects` section component** — import `flushSync`, add `handleCardClick`, pass `selected` to each `ProjectCard`:

```jsx
import { flushSync } from 'react-dom'

const handleCardClick = (p) => {
  if ('startViewTransition' in document) {
    document.startViewTransition(() => {
      flushSync(() => setSelected(p))
    })
  } else {
    setSelected(p)
  }
}

// In JSX:
<ProjectCard
  key={p.id}
  project={p}
  selected={selected}
  onClick={() => handleCardClick(p)}
/>
```

### `src/index.css`

Add after all existing rules, outside any `@layer` block:

```css
/* Suppress the default root cross-fade — only the shared image should animate */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
}

/* Shared image morph — geometry and timing on the group pseudo-element */
::view-transition-group(*) {
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Suppress old/new cross-fade dissolve — pure morph, no ghosting */
::view-transition-old(*),
::view-transition-new(*) {
  animation: none;
}

/* View-transition pseudo-elements live outside the normal selector scope
   and are not matched by the global * rule, so they need explicit overrides. */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-image-pair(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.01ms !important;
  }
}
```

> `::view-transition-group(*)` controls morph geometry (position + size interpolation).
> Suppressing old/new animations removes the cross-fade, giving a clean morph.
> The reduced-motion block is necessary because view-transition pseudo-elements are outside
> the normal DOM selector scope — the existing global `* { animation-duration }` rule
> in `index.css` does NOT reach them.

## GSAP Interaction

`ProjectModal` has no GSAP entrance animations — GSAP is only used for scroll-triggered animations on the `Projects` section heading and card grid. No conflict.

## Known Limitation — Screenshot Load Race

The modal fetches the desktop screenshot asynchronously (`getOrFetchScreenshot`). If the screenshot has not resolved by the time the transition fires, the "after" snapshot will show the fallback title card rather than the image. In practice this is rare: the card already fetched and cached the same URL, so the modal's fetch resolves quickly from cache. The morph still completes correctly; the image then fades in via the existing `transition-opacity` on the `<img>` after the view transition ends.

## Fallback

Browsers without `startViewTransition` (Firefox, Safari < 18) open the modal instantly — zero regression. The guard is inside `handleCardClick` in `Projects.jsx`.

## Out of Scope

- Closing transition (modal → card)
- Route-based transitions
- Mobile-specific tweaks
