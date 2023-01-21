type Containee = {
  container?: Container;
}

type ListContainer = { items: readonly Containee[]; }
function isListContainer(c: Container): c is ListContainer {
  return !!(c as any).items;
}

type Container = Containee & (
  ListContainer |
  { contents: { [key: string]: Containee; }; }
);

export function getPath(e: Containee) {
  const path: (string | number)[] = [];
  while (e.container) {
    const c = e.container;
    if (isListContainer(c)) {
      for (let i = 0; i < c.items.length; i++) {
        if (e === c.items[i]) {
          path.push(i);
        }
      }
    } else {
      for (const [name, item] of Object.entries(c.contents)) {
        if (e === item) {
          path.push(name);
        }
      }
    }

    e = e.container;
  }

  return path.reverse();
}