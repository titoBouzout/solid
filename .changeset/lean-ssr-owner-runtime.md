---
"solid-js": patch
---

Replace the upstream `@solidjs/signals` owner runtime with a lean SSR-specific implementation. The server is single-pass and pull-based, so the scheduler / heap / zombie graph / observer linked list that the upstream owner carries serve no purpose during SSR. The new `SSROwner` shape is a forward-only linked list with cleanup hooks and an id (~9 fields vs. ~14 upstream), plus a freelist that recycles owners across the disposal at end-of-render — repeat renders of the same shape pay ~0 steady-state owner allocation.

Layered on top:

- `mapArray` and `repeat` rows reuse the parent memo owner instead of allocating a new owner per iteration. Per-row id parity with the client is preserved by mutating the memo owner's `id` and resetting `_childCount` for each iteration; nested compiler-emitted memos / providers / boundaries see the correct synthetic row id as their parent prefix. Safe because `mapFn` runs once per render (sync `NotReadyError` propagates up through the `sync: true` outer memo and the engine reruns the whole `mapArray`) and async retries always live in their own nested owners with snapshotted ids.

- `createSyncMemo` is a separate lean memo for computes statically guaranteed to return synchronously (compiler-emitted `_$memo` / `_$effect` wrappers, internal control-flow primitives). It skips the full `ServerComputation` / `processResult` / `$REFRESH` / `runWithObserver` / `onCleanup` scaffolding that async memos need, while still letting `NotReadyError` propagate to the nearest boundary.

- The Loading boundary now uses `disposeOwner(o, false)` directly (instead of `o.dispose(false)`) to wipe the boundary's children on retry while keeping the boundary owner itself alive for the re-run. `SSRTemplateObject` is widened to a union covering both the heavy `{ t: string[]; h: Function[]; p: Promise[] }` shape and the leaf `{ t: string }` shape; the boundary's pending-loop narrows to the heavy variant before threading values back through `ctx.ssr`.
