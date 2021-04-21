export function unimplemented(): never {
  throw new Error('unimplemented method');
}

type BoomOptions = string | (() => never);

export function boom(option?: BoomOptions): never {
  if (typeof option === 'function') return option();
  if (typeof option === 'string') throw new Error(option);

  throw new Error('An unknown error has occurred');
}
