import { createEffect, createRoot, createSignal, flush } from "../src/index.js";

afterEach(() => flush());

it("should batch updates", () => {
  const [$x, setX] = createSignal(10);
  const effect = vi.fn();

  createRoot(() => createEffect($x, effect));
  flush();

  setX(20);
  setX(30);
  setX(40);

  expect(effect).to.toHaveBeenCalledTimes(1);
  flush();
  expect(effect).to.toHaveBeenCalledTimes(2);
});

it("should wait for queue to flush", () => {
  const [$x, setX] = createSignal(10);
  const $effect = vi.fn();

  createRoot(() => createEffect($x, $effect));
  flush();

  expect($effect).to.toHaveBeenCalledTimes(1);

  setX(20);
  flush();
  expect($effect).to.toHaveBeenCalledTimes(2);

  setX(30);
  flush();
  expect($effect).to.toHaveBeenCalledTimes(3);
});

it("should not fail if called while flushing", () => {
  const [$a, setA] = createSignal(10);

  const effect = vi.fn(() => {
    flush();
  });

  createRoot(() => createEffect($a, effect));
  flush();

  expect(effect).to.toHaveBeenCalledTimes(1);

  setA(20);
  flush();
  expect(effect).to.toHaveBeenCalledTimes(2);
});

it("should run callback and flush before returning", () => {
  const [$x, setX] = createSignal(10);
  const effect = vi.fn();

  createRoot(() => createEffect($x, effect));
  flush();

  const result = flush(() => {
    setX(20);
    expect(effect).to.toHaveBeenCalledTimes(1);
    return "done";
  });

  expect(result).toBe("done");
  expect(effect).to.toHaveBeenCalledTimes(2);
});

it("nested flush(fn) drains at each level", () => {
  const [$x, setX] = createSignal(10);
  const [$y, setY] = createSignal(10);
  const effect = vi.fn();

  createRoot(() => createEffect(() => [$x(), $y()], effect));
  flush();

  flush(() => {
    setX(20);
    expect(effect).to.toHaveBeenCalledTimes(1);

    const inner = flush(() => {
      setY(30);
      expect(effect).to.toHaveBeenCalledTimes(1);
      return 1;
    });

    expect(inner).toBe(1);
    // Inner flush drained, so effect already saw [20, 30].
    expect(effect).to.toHaveBeenCalledTimes(2);
  });

  // Outer flush drain finds nothing pending — no extra call.
  expect(effect).to.toHaveBeenCalledTimes(2);
});
