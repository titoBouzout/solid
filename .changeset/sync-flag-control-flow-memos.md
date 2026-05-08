---
"solid-js": patch
---

Mark internal control-flow memos as `sync: true` on both client and server runtimes (`Show`, `Switch`, `mapArray`'s outer body, `repeat`'s outer body, `children`'s outer flatten memo, `lazy`'s outer render memo, plus `Show` / `Switch` non-keyed condition wrappers). The user-input-facing memos (`when={…}`, `each={…}`, `props.children` getter, `lazy()`'s pending promise) stay async-shape aware. This skips the per-recompute Promise/AsyncIterable probe in `recompute` (client) and the corresponding `ServerComputation` / `processResult` / `$REFRESH` scaffolding (server) for memos statically guaranteed to return synchronously, reducing per-render overhead in SSR and client renders without affecting async behavior.
