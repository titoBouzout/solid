---
"solid-js": patch
---

Fix the Tier-1 SSR `search-results` / `color-picker` benches under `packages/solid-web/test/server/`. Both files now carry a `@jsxImportSource @solidjs/web` pragma so `tsc --project tsconfig.test.json` can resolve `JSX.IntrinsicElements`. The `search-results` bench had a latent typing bug — it passed the row accessor through `<For>` while typing the row component's prop as the resolved `SearchItem`, so every `props.item.title` read returned `undefined` and the bench was silently emitting empty `textContent` for every dynamic field. The bench now mirrors the realistic Solid 2.0 keyed shape under performance optimized situations: dereference the row accessor at the `<For>` boundary, destructure `props.item` once at function entry, then read plain locals in the JSX. This means a single props-proxy trap per row instead of one per field access, and the bench now actually measures rendering of real data.
