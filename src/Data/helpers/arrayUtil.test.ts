import { arrEqual } from "./arrayUtil"

it("returns true for equal arrays", () => {
  expect(arrEqual([], [])).toBe(true);
  expect(arrEqual(["", "a", "ab"], ["", "a", "ab"])).toBe(true);
  expect(arrEqual([1,2,3], [1,2,3])).toBe(true);
});

it("returns false for unequal arrays", () => {
  expect(arrEqual([], [1])).toBe(false);
  expect(arrEqual(["", "a", "ab"], ["a", 2, {}])).toBe(false);
  expect(arrEqual([1,2,[1]], [1,2,3])).toBe(false);
});

it("does not detect deep equality", () => {
  const a = {};
  expect(arrEqual([a],[a])).toBe(true);
  expect(arrEqual([a],[{}])).toBe(false);
});