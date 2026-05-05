---
"@solidjs/signals": patch
---

Reduce effect creation overhead by sharing status notification logic, registering effect cleanups lazily, and avoiding generic store proxy work for tracked reads of absent plain-object properties.
