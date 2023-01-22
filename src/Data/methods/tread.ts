import { EntityInterface } from "../../interface"

export function tread(e: EntityInterface, arg1?: number | string | (string | number)[], path?: string | (string | number)[]) {
  let backtrack: number | undefined;
  if (typeof arg1 !== "number") {
    path = arg1;
  } else {
    backtrack = arg1;
  }

  if (backtrack) for (let _ = 0; _ < backtrack; _++) {
    const c = e.container;
    if (!c) break;
    e = c;
  }

  if (!path) {
    return e.data.tread(e.path);
  } else {
    if (typeof path === "string") {
      path = path.split(".").map(p => /^\d+$/.test(p) ? Number(p) : p);
    }
    return e.data.tread(e.path.concat(path));
  }
}