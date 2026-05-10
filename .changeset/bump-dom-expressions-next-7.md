---
"solid-js": patch
---

Bump dom-expressions, babel-plugin-jsx-dom-expressions, hyper-dom-expressions, and sld-dom-expressions to 0.50.0-next.7. Picks up the SSR attribute/textContent grouping change: the compiler now coalesces contiguous runs of dynamic attribute and `textContent` closures into a single `_$ssrGroup(() => […], N)` per element, and the runtime resolves all `N` hole positions through one closure invocation instead of `N`. Inserts/children stay separate so child isolation and hydration ids are unaffected. Bench: ~+15% on `search-results` (heavy attribute usage), neutral on `color-picker` (no qualifying groups).
