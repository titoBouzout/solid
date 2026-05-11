---
"solid-js": patch
---

Bump dom-expressions, babel-plugin-jsx-dom-expressions, hyper-dom-expressions, and sld-dom-expressions to 0.50.0-next.8.

- **SSR attribute/textContent grouping** (next.7): the compiler now coalesces contiguous runs of dynamic attribute and `textContent` closures into a single `_$ssrGroup(() => […], N)` per element, and the runtime resolves all `N` hole positions through one closure invocation instead of `N`. Inserts/children stay separate so child isolation and hydration ids are unaffected. Bench: ~+15% on `search-results` (heavy attribute usage), neutral on `color-picker` (no qualifying groups).
- **SSR bail-path single-invocation fix** (next.8): `ssr()` was invoking certain function holes twice when their return value walked into the bail branch (e.g., an array containing a NotReady-throwing item). For closures that read stateful getters such as JSX `props.children` — which rebuilds an owner subtree on each access — the duplicate invocation produced a divergent hydration-key prefix that the client could not claim, surfacing as "Hydration completed with N unclaimed server-rendered node(s)" warnings. The bail path now consumes the already-evaluated value instead of re-invoking the original closure.
