---
"@solidjs/signals": patch
"@solidjs/web": patch
---

Performance: add `CONFIG_SYNC` opt-in for sync-only computeds/effects. New `sync?: boolean` option on `MemoOptions`/`EffectOptions` skips the async-shape probe in `recompute` for nodes that provably never return Promise/AsyncIterable. Compiler-emitted `_$effect` and `_$memo` (via `@solidjs/web`'s `effect`/`memo` wrappers) opt in by default — `01_run1k` mean −0.62 ms and `08_create1k-after1k_x2` mean −0.80 ms in `js-framework-benchmark`. User-authored `createMemo`/`createEffect`/`createRenderEffect` keep full async-aware behavior unless they explicitly pass `sync: true`. Returning a Promise from a `sync: true` node throws `SYNC_NODE_RECEIVED_ASYNC` in dev (production silently stores the unawaited value, by contract).

Correctness: `flush(fn)` now drains at every nesting level instead of only the outermost. Nested `flush(fn)` calls each honor their own contract — writes inside an inner `flush(fn)` propagate before it returns, rather than being held until the outer `flush(fn)` exits. Microtask scheduling and arg-less `flush()` are unchanged. Code that depended on the old hold-until-outermost behavior should switch to a harness-layer depth counter (see `js-reactivity-benchmark`'s `r3` / `r3-solid-target` adapters for the pattern).
