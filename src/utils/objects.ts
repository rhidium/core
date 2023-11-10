import { diff as deepObjectDiff } from 'deep-object-diff';

export type GenericObject = Record<string, unknown>;

const diff = deepObjectDiff;

const findChanges = (
  obj1: { [key: string]: unknown },
  obj2: { [key: string]: unknown },
) => {
  const changes: {
      key: string;
      oldValue: unknown;
      newValue: unknown;
    }[] = [];
  const diffState = diff(obj1, obj2);
  Object.entries(diffState).forEach(([key, value]) => {
    const obj1Val = obj1[key];
    if (typeof value === 'object') {
      if (typeof obj1Val !== 'object') {
        changes.push({
          key,
          oldValue: `type ${typeof obj1Val}`,
          newValue: `type ${typeof value}`,
        });
      } else {
        const inner = findChanges(obj1Val as GenericObject, obj2[key] as GenericObject);
        inner.forEach(change => {
          change.key = `${key}.${change.key}`;
        });
        changes.push(...inner);
      }
    } else {
      const isSame = obj1Val === value;
      if (!isSame) {
        changes.push({
          key,
          oldValue: obj1Val,
          newValue: value,
        });
      }
    }
  });
  return changes;
};

const isObject = (item: unknown): item is GenericObject =>
  typeof item === 'object' && item !== null;

const isObjectEmpty = (item: unknown): item is GenericObject =>
  isObject(item) && Object.keys(item).length === 0;

const deepMerge = <T extends GenericObject>(obj1: T, obj2: T): T => {
  const result = { ...obj1 };
  for (const [key, value] of Object.entries(obj2)) {
    const obj1Val = obj1[key];
    const obj2Val = value;
    const areBothObj = isObject(obj1Val) && isObject(obj2Val);
    Object.defineProperty(result, key, {
      value: areBothObj ? deepMerge(obj1Val, obj2Val) : obj2Val,
      writable: true,
      configurable: true,
    });
  }
  return result;
};

const deepClone = <T extends GenericObject>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

const deepFreeze = <T extends GenericObject>(obj: T): T => {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      prop in obj &&
        obj[prop] !== null &&
        (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
        !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop] as T);
    }
  });
  return obj;
};

const deepSeal = <T extends GenericObject>(obj: T): T => {
  Object.seal(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      prop in obj &&
        obj[prop] !== null &&
        (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
        !Object.isSealed(obj[prop])
    ) {
      deepSeal(obj[prop] as T);
    }
  });
  return obj;
};

const deepPreventExtensions = <T extends GenericObject>(obj: T): T => {
  Object.preventExtensions(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      prop in obj &&
        obj[prop] !== null &&
        (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
        !Object.isExtensible(obj[prop])
    ) {
      deepPreventExtensions(obj[prop] as T);
    }
  });
  return obj;
};

const deepKeys = <T extends GenericObject>(obj: T): string[] => {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    keys.push(key);
    if (isObject(value)) keys.push(...deepKeys(value));
  }
  return keys;
};

const deepValues = <T extends GenericObject>(obj: T): unknown[] => {
  const values: unknown[] = [];
  for (const value of Object.values(obj)) {
    values.push(value);
    if (isObject(value)) values.push(...deepValues(value));
  }
  return values;
};

const deepEntries = <T extends GenericObject>(
  obj: T,
): [string, unknown][] => {
  const entries: [string, unknown][] = [];
  for (const [key, value] of Object.entries(obj)) {
    entries.push([key, value]);
    if (isObject(value)) entries.push(...deepEntries(value));
  }
  return entries;
};

const deepIncludes = <T extends GenericObject>(
  obj: T,
  value: unknown,
): boolean => {
  for (const v of deepValues(obj)) {
    if (v === value) return true;
  }
  return false;
};

const deepIncludesKey = <T extends GenericObject>(
  obj: T,
  key: string,
): boolean => {
  for (const k of deepKeys(obj)) {
    if (k === key) return true;
  }
  return false;
};

const deepIncludesValue = <T extends GenericObject>(
  obj: T,
  value: unknown,
): boolean => {
  for (const v of deepValues(obj)) {
    if (v === value) return true;
  }
  return false;
};

const deepIncludesEntry = <T extends GenericObject>(
  obj: T,
  entry: [string, unknown],
): boolean => {
  for (const e of deepEntries(obj)) {
    if (e[0] === entry[0] && e[1] === entry[1]) return true;
  }
  return false;
};

export class ObjectUtils {
  static readonly diff = diff;
  static readonly findChanges = findChanges;
  static readonly isObject = isObject;
  static readonly isObjectEmpty = isObjectEmpty;
  static readonly deepMerge = deepMerge;
  static readonly deepClone = deepClone;
  static readonly deepFreeze = deepFreeze;
  static readonly deepSeal = deepSeal;
  static readonly deepPreventExtensions = deepPreventExtensions;
  static readonly deepKeys = deepKeys;
  static readonly deepValues = deepValues;
  static readonly deepEntries = deepEntries;
  static readonly deepIncludes = deepIncludes;
  static readonly deepIncludesKey = deepIncludesKey;
  static readonly deepIncludesValue = deepIncludesValue;
  static readonly deepIncludesEntry = deepIncludesEntry;
}
