//@ts-nocheck
import { createMemo, createRenderEffect } from "solid-js";
export {
  getOwner,
  runWithOwner,
  createComponent,
  createRoot as root,
  sharedConfig,
  untrack,
  merge as mergeProps,
  flatten,
  ssrHandleError,
  ssrRunInScope
} from "solid-js";

const transparentOptions = { transparent: true, sync: true };
const syncOptions = { sync: true };
export const effect = (fn, effectFn, options) =>
  createRenderEffect(
    fn,
    effectFn,
    options ? { transparent: true, sync: true, ...options } : transparentOptions
  );

export const memo = fn => createMemo(() => fn(), syncOptions);
