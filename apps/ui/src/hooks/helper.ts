type NonNilFn<T extends (...args: unknown[]) => unknown> = ReturnType<T> extends undefined | infer X
  ? (...args: Parameters<T>) => X
  : never;

export function createNonNilStateHook<T extends (...args: unknown[]) => unknown>(hook: T): NonNilFn<T> {
  return (((...args: unknown[]) => {
    const x = hook(...args);
    if (x == null) throw new Error('');
    return x;
  }) as unknown) as NonNilFn<T>;
}
