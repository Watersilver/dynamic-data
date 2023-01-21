const path: unknown[] = [];
export function isCyclic(object: object) {
  for (const ancestor of path) {
    if (object === ancestor) return true;
  }
  path.push(object);
  if (Array.isArray(object)) {
    for (const item of object) {
      if (item && typeof item === "object" && isCyclic(item)) {path.pop(); return true;}
    }
    path.pop();
  } else {
    for (const value of Object.values(object)) {
      if (value && typeof value === "object" && isCyclic(value)) {path.pop(); return true;}
    }
    path.pop();
  }

  return false;
}

// It helps to accept undefined and just skip it and treat as non existing instead of rejecting it.
export type Json = boolean | null | string | number | Json[] | {[key: string]: Json} | undefined
const dupes: unknown[] = [];
export function isJson(json: unknown): json is Json {
  for (const dupe of dupes) {
    if (json === dupe) return true;
  }
  dupes.push(json);

  switch (typeof json) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      dupes.pop();
      return true;
    case "object":
      if (json === null) {
        dupes.pop();
        return true;
      }
      if (Array.isArray(json)) {
        for (const item of json) {
          if (!isJson(item)) return false;
        }
        dupes.pop();
        return true;
      } else {
        for (const value of Object.values(json)) {
          if (!isJson(value)) return false;
        }
        dupes.pop();
        return true;
      }
  }

  return false;
}

let depth = 0;
/** Returns true if superset includes every part of subset. Cannot handle cyclic structures. */
export function includes(superset: Json, subset: Json) {
  if (depth === 0) {
    if (typeof superset === "object" && superset && isCyclic(superset)) throw TypeError("Superset is cyclic structure.");
    if (typeof subset === "object" && subset && isCyclic(subset)) throw TypeError("Subset is cyclic structure.");
  }

  // False if types are incompatible
  if (subset === superset) return true;
  const types = typeof superset;
  if (types !== typeof subset) return false;
  // object type includes array and null so check those too.
  if (superset === null) return false;
  const arrays = Array.isArray(superset);
  if (arrays != Array.isArray(subset)) return false;

  if (arrays) {
    depth++;
    for (let i = 0; i != (subset as Json[]).length; ++i) {
      const si = superset[i];
      if (si === undefined || !includes(si, (subset as Json[])[i] as Json)) {depth--; return false;}
    }
    depth--;
    return true;
  } else if (types === "number") {
    return (superset as number) >= (subset as number);
  } else if (types === "string") {
    return (superset as string).includes(subset as string);
  } else if (types === "object") {
    depth++;
    for (const [key, json] of Object.entries(subset as {[key: string]: Json})) {
      const sk = (superset as {[key: string]: Json})[key];
      if (sk === undefined || !includes(sk, json)) {depth--; return false;}
    }
    depth--;
    return true;
  }

  return false;
};

export function clone(json: Json) {
  return JSON.parse(JSON.stringify(json));
}

/** Returns true if two jsons deep equal one another. Cannot handle cyclic structures. */
export function equals(json1: Json, json2: Json) {
  return includes(json1, json2) && includes(json2, json1);
}