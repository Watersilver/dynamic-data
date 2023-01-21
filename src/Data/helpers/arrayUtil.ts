function _arrIncludes(a1: unknown[], a2: unknown[]): [boolean, boolean | undefined] {
  // remove dupes
  const s1 = new Set(a1);
  const s2 = new Set(a2);

  // Check containment
  for (const i of s2) {
    if (!s1.has(i)) return [false, undefined];
  }
  return [true, s1.size === s2.size];
}

export function arrEqual(a1: unknown[], a2: unknown[]) {
  const [_, equal] = _arrIncludes(a1, a2);
  return !!equal;
}

export function arrIncludes(superset: unknown[], subset: unknown[]) {
  const [includes] = _arrIncludes(superset, subset);
  return includes;
}
