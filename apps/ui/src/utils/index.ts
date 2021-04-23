export function truncateMiddle(str: string, start: number, end = start): string {
  if (!start || !end || start <= 0 || end <= 0) throw new Error('start or end is invalid');
  if (str.length <= start + end) return str;
  return str.slice(0, start) + '...' + str.slice(-end);
}

export function asserts(cond: unknown, message = 'Assertion failed'): asserts cond {
  if (cond) return;
  throw new Error(message);
}
