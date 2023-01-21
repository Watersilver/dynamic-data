import { clone, equals, includes, isCyclic, isJson } from "./Json";

describe("isCyclic", () => {
  it("returns true for cyclic structures", () => {
    const obj = {
      a: {d: {}},
      b: {},
      c: {}
    }
    obj.a.d = obj;
    expect(isCyclic(obj)).toBe(true);
    obj.a.d = obj.a;
    expect(isCyclic(obj)).toBe(true);
    const arr = [{}];
    arr[0] = arr;
    expect(isCyclic(obj)).toBe(true);
  });
  it("returns false for non cyclic structures", () => {
    expect(isCyclic({
      a: {b: {c: [{d: 1}]}},
      e: [{f: 2}]
    })).toBe(false);
    expect(isCyclic([])).toBe(false);
  });
});

describe("includes", () => {
  it("correctly detects object and array json inclusion", () => {
    expect(includes({}, {})).toBe(true);
    expect(includes([], [])).toBe(true);
    expect(includes({
      a: {},
      b: {c: {}},
      d: {},
      e: [[], {}]
    }, {})).toBe(true);
    expect(includes({
      a: {},
      b: {c: {}},
      d: {},
      e: [[], {}]
    }, {a:{}, b: {}, d: {}, e: [[]]})).toBe(true);
    expect(includes({}, {a: {}})).toBe(false);
  });

  it("treats equality as successful inclusion.", () => {
    expect(includes({a: {}}, {a: {}})).toBe(true);
    expect(includes([[]], [[]])).toBe(true);
    expect(includes(1, 1)).toBe(true);
    expect(includes("a", "a")).toBe(true);
    expect(includes(true, true)).toBe(true);
    expect(includes(false, false)).toBe(true);
    expect(includes(null, null)).toBe(true);
  });

  it("treats bigger numbers as supersets of themselves and smaller numbers", () => {
    expect(includes(5, 4)).toBe(true);
    expect(includes(5, 5)).toBe(true);
    expect(includes(5, 6)).toBe(false);
  });

  it("treats string a that includes substring of string b as superset of b", () => {
    expect(includes("erty", "erty")).toBe(true);
    expect(includes("erty", "ert")).toBe(true);
    expect(includes("erty", "")).toBe(true);
    expect(includes("", "erty")).toBe(false);
    expect(includes("ert", "erty")).toBe(false);
  });

  it("treats all other types as incompatible with each other.", () => {
    const types = [{}, [], 1, true, undefined, "a"];
    for (const superset of types) {
      for (const subset of types) {
        if (superset !== subset) {
          expect(includes(superset, subset)).toBe(false);
        }
      }
    }
  });
});

describe("equals", () => {
  it("performs deep equality check for json objects", () => {
    expect(equals({a: {}}, {a: {}})).toBe(true);
    expect(equals([[]], [[]])).toBe(true);
    expect(equals(1, 1)).toBe(true);
    expect(equals("a", "a")).toBe(true);
    expect(equals(true, true)).toBe(true);
    expect(equals(false, false)).toBe(true);
    expect(equals(null, null)).toBe(true);
    expect(equals({a: {}, b: [{c: 1, d: "e", f: {g: true}}]}, {a: {}, b: [{c: 1, d: "e", f: {g: true}}]})).toBe(true);
    expect(equals({a: {}, b: [{c: 1, d: "e", f: {g: false}}]}, {a: {}, b: [{c: 1, d: "e", f: {g: true}}]})).toBe(false);
    expect(equals({
      a: {},
      b: {c: {}},
      d: {},
      e: [[], {}]
    }, {})).toBe(false);
    expect(equals({
      a: {},
      b: {c: {}},
      d: {},
      e: [[], {}]
    }, {a:{}, b: {}, d: {}, e: [[]]})).toBe(false);
  });
});

describe("isJson", () => {
  it("detects if object is a json structure.", () => {
    expect(isJson({a: {b: 1}, c: ["d"], e: true, f: false, g: null})).toBe(true);
    expect(isJson({a: () => {}})).toBe(false);
  });

  it("can handle cyclic structures.", () => {
    const obj = {
      b: {},
      c: {},
      w: {d: {}},
    }
    obj.w.d = obj;
    expect(isJson(obj)).toBe(true);
    const obj2 = {
      b: {},
      c: {},
      w: [{}, () => {}],
    }
    obj2.w[0] = obj;
    expect(isJson(obj2)).toBe(false);
  });
});

describe("clone", () => {
  it("clones json", () => {
    const cloned = clone({a: 1, b: {}, c: [{d: "a"}]});
    expect(equals(cloned, {a: 1, b: {}, c: [{d: "a"}]}));
  });
})