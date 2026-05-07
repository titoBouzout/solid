---
"@solidjs/signals": patch
---

perf(store): split `applyState` into fast/slow paths and tighten store hot-path

`applyState` now dispatches at every (recursive) call between a `applyStateFast`
body for plain stores and an `applyStateSlow` body for stores with override or
optimistic-override slots set. The fast body never calls `getOverrideValue` and
never branches on a `fastPath` flag, so V8 sees a tighter, more inlinable shape
in the overwhelmingly common case. Validated end-to-end with UIBench: ~18–21%
total render time improvement, with no regression in `js-framework-benchmark`.

Also:

- `isWrappable` restructured for an early-return hot path on the common
  `null` / non-object cases.
- `createStoreProxy` now only stamps `STORE_CUSTOM_PROTO` when the prototype
  is non-trivial, avoiding the extra slot on the default object/array path.
