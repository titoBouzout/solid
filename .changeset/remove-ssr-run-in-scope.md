---
"solid-js": patch
---

Remove `ssrRunInScope` from the public surface. The function had been a true pass-through identity (`fn => fn`) on the server runtime since owner-capture moved into `tryResolveString`'s `NotReadyError` handler, and the compiler no longer emits it. With no internal callers and no behavior to provide, the export was dead surface area and is now removed from `solid-js` (server export, server core impl, client stub) and from `@solidjs/web`'s `rxcore` re-export. User code that called it can drop the wrap (it was a no-op) or replicate the original deferred-callback owner-capture intent in two lines with `getOwner()` + `runWithOwner()`.
