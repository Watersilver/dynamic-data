function _clone(object: any, clones: WeakMap<any, any>) {
  if (typeof object === "object") {
    if (object === null) return object;
    if (clones.has(object)) return clones.get(object);
    if (Array.isArray(object)) {
      const c: any[] = [];
      clones.set(object, c);
      let i = 0;
      for (const item of object) {
        c.push(_clone(item, clones));
        i++;
      }
      return c;
    } else if (object instanceof Map) {
      const c = new Map();
      clones.set(object, c);
      for (const [key, value] of object) {
        c.set(key, _clone(value, clones));
      }
      return c;
    } else if (object instanceof Set) {
      const c = new Set();
      clones.set(object, c);
      for (const item of object) {
        c.add(_clone(item, clones));
      }
      return c;
    } else {
      const c: any = {};
      clones.set(object, c);
      for (const [key, value] of Object.entries(object)) {
        c[key] = _clone(value, clones);
      }
      for (const symbol of Object.getOwnPropertySymbols(object)) {
        c[symbol] = _clone(object[symbol], clones);
      }
      return c;
    }
  } else {
    return object;
  }
}

export function clone<T>(object: T): T { return _clone(object, new WeakMap()); }