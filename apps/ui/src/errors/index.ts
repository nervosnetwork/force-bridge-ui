export function boom(option?: BoomOptions): never {
  if (typeof option === 'function') return option();
  if (typeof option === 'string') throw new Error(option);

  throw new Error('An unknown error has occurred');
}

export function unimplemented(): never {
  throw new Error('Unimplemented method');
}

export function nonNil(): never {
  throw new Error('The value must NOT be null or undefined');
}

type BoomOptions = string | (() => never);

export function asserts(condition: unknown, err?: (() => never) | string): asserts condition {
  if (condition) return;
  if (typeof err === 'string') return boom(err);
  if (typeof err === 'function') return err();
  boom('assert error');
}
