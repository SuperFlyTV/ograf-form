export function assertNever(_never: never): void {
  // Do nothing. This is a type guard
}
//
export function isEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true;
  if (typeof objA !== typeof objB) return false;

  if (typeof objA === "object") {
    if (objA === null || objB === null) return objA === objB;

    if (Array.isArray(objA)) {
      if (!Array.isArray(objB)) return false;
      if (objA.length !== objB.length) return false;

      for (let i = 0; i < objA.length; i++) {
        if (!isEqual(objA[i], objB[i])) return false;
      }
    } else {
      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) return false;
      // are the keys the same?
      keysA.sort();
      keysB.sort();

      for (let i = 0; i < keysA.length; i++) {
        const keyA = keysA[i];
        const keyB = keysB[i];
        if (keyA !== keyB) return false;

        if (!isEqual(objA[keyA], objB[keyB])) return false;
      }
    }
    return true;
  }
  return objA === objB;
}
export function clone<T>(obj: T): T {
  if (obj === undefined) return obj;

  return JSON.parse(JSON.stringify(obj));
}
export function unique(keys: string[]): string[] {
  return Array.from(new Set(keys));
}
export function lookupKeys(
  keys: string[],
  obj: Record<string, unknown>
): { existing: string[]; missing: string[] } {
  const existing: string[] = [];
  const missing: string[] = [];

  for (const key of keys) {
    if (key in obj) existing.push(key);
    else missing.push(key);
  }

  return { existing, missing };
}
export function last<T>(
  items: Iterable<T> | ArrayLike<T> | T[] | undefined
): T | undefined {
  if (!items) return undefined;
  const array = Array.from(items);

  return array[array.length - 1];
}
