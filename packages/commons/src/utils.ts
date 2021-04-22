export function hasProp<O, K extends string | number | symbol>(obj: O, key: K): obj is Record<K, unknown> & O {
  return obj != null && typeof obj === 'object' && key in obj;
}

interface Prop {
  <O, K extends string>(obj: O, key: K): O extends Record<K, unknown> ? O[K] : unknown;

  <O, K extends string, V>(obj: O, key: K, defaults: V): O extends Record<K, unknown> ? O[K] : V;
}

export const prop: Prop = <O, K extends string, V>(obj: O, key: K, defaults?: V) => {
  if (hasProp(obj, key)) {
    return obj[key] || defaults;
  }
  return defaults;
};

export function propEq<O, K extends string, V>(obj: O, key: K, v: V): obj is Record<K, V> & O {
  return prop(obj, key) === v;
}
