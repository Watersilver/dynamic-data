import { getPath } from "./getPath";

type Containee = {
  container?: Container;
}

type ListContainer = { items: readonly Content[]; }
function isListContainer(c: Content): c is ListContainer {
  return !!(c as any).items;
}

type Container = Containee & (
  ListContainer |
  { contents: { [key: string]: Content; }; }
);
function isContainer(c: Content): c is Container {
  return isListContainer(c) || (c as any).contents;
}

type Content = Container | Containee;

function create(c: Content): Content {
  if (isContainer(c)) {
    if (isListContainer(c)) {
      for (const item of c.items) {
        item.container = c;
        create(item);
      }
    } else {
      for (const item of Object.values(c.contents)) {
        item.container = c;
        create(item);
      }
    }
  }
  return c;
}

function navigate(c: Content, path: (number | string)[]) {
  for (const p of path) {
    if (isContainer(c)) {
      if (isListContainer(c)) {
        if (typeof p !== "number") return undefined;
        const item = c.items[p];
        if (!item) return undefined;
        c = item;
      } else {
        if (typeof p !== "string") return undefined;
        const item = c.contents[p];
        if (!item) return undefined;
        c = item;
      }
    }
  }
  return c;
}

it("computes path correctly", () => {
  let c: Content;
  let t: Containee | undefined;
  c = create({
    contents: {
      erty: {
        contents: {
          zerty: {}
        }
      }
    }
  });
  t = navigate(c, ["erty", "zerty"]);

  expect(t).not.toBe(undefined);
  
  if (!t) return;

  expect(getPath(t)).toEqual(["erty", "zerty"]);

  c = create({
    contents: {
      a: {},
      z: {
        items: [
          {},
          {},
          {
            items: [{contents: {b: {}}}]
          }
        ]
      }
    }
  });
  t = navigate(c, ["z", 2, 0, "b"]);

  expect(t).not.toBe(undefined);
  
  if (!t) return;

  expect(getPath(t)).toEqual(["z", 2, 0, "b"]);

  c = create({});
  expect(getPath(c)).toEqual([]);
});