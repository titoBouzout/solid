---
"solid-js": patch
---

Fix memory leak where individually-disposed owners (e.g. `<For>` rows whose
keyed-by-identity entries are replaced) stayed wired into their parent's
`_firstChild → _nextSibling` chain forever, causing zombie Owner shells to
accumulate per click. The previous fix (`ac50d5cf`) had stopped nulling
`_nextSibling` to keep the chain intact during cascading `unobserved()` walks,
but that left no path to detach an individually-disposed node from its parent.

Owners now form a doubly-linked sibling list (`_prevSibling` added to the
`Owner` shape, mirroring how subscriptions already use `_prevSub`/`_nextSub`).
On individual disposal we splice the node out of its parent's chain in O(1).
The splice is skipped when the parent is itself being torn down (batch
dispose path is unchanged) or when the node was already a zombie sitting on
`_pendingFirstChild`. The disposed node's own `_nextSibling` is deliberately
left intact so an in-flight outer dispose walk that already advanced past
this node still reaches later siblings — preserving the cascade-safety from
the original fix.
