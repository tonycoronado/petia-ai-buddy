import { useCallback, useState } from "react";

export function useScreenStack<T extends string>() {
  const [stack, setStack] = useState<T[]>([]);
  const push = useCallback((s: T) => setStack((prev) => [...prev, s]), []);
  const pop = useCallback(() => setStack((prev) => prev.slice(0, -1)), []);
  const reset = useCallback(() => setStack([]), []);
  const current = stack.length ? stack[stack.length - 1] : null;
  return { stack, current, push, pop, reset, depth: stack.length };
}
