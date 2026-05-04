---
"solid-js": patch
---

fix(signals): `refresh()` no longer cascades into upstream memos. Only the memos read at the top level of the refresh callback (or the explicit `refresh(memo)` target) recompute; their dependencies are left untouched. `isRefreshing()` still reports `true` for the entire refresh call so consumers can opt into deeper refresh manually.
