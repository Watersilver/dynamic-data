import { isGroup, isList } from "../../interface"
import { Requirement } from "../../schema"
import Data from "../Data"
import { equals, includes, Json } from "../helpers/Json"

function isPath(a: any[]): a is (string | number)[] {
  for (const i of a) {
    if (typeof i !== "string" && typeof i !== "number") return false;
  }
  return true;
}

type Comparison = "exists"
| "not exists"
| "equals"
| "not equals"
| "includes"
| "is included in"
function satisfiesSingleRequirement(d: Data, path: (string | number)[], comparison?: Comparison, value?: Json) {
  let e = d.entity;

  // Get to entity of path
  for (const name of path) {
    if (typeof name === "number") {
      if (!isList(e)) return false;
      const item = e.items[name];
      if (!item) return false;
      e = item;
    } else {
      if (!isGroup(e)) return false;
      const item = e.contents[name];
      if (!item) return false;
      e = item;
    }
  }

  // At this point e is entity pointed to by path

  if (!e.valid) return false;

  switch (comparison) {
    case "equals":
      return equals(e.value, value);
    case "not equals":
      return !equals(e.value, value);
    case "includes":
      return includes(e.value, value);
    case "is included in":
      return includes(value, e.value);
    case "not exists":
      return e.empty;
    default:
      return !e.empty;
  }
}
export function satisfiesRequirement(d: Data, r: Requirement) {
  if (Array.isArray(r)) {
    if (isPath(r)) return satisfiesSingleRequirement(d, r);

    return satisfiesSingleRequirement(d, r[0], r[1], r[2])
  } else if (r.discriminator === "allOf") {
    for (const req of r.requirements) {
      if (!satisfiesRequirement(d, req)) return false;
    }
    return true;
  } else if (r.discriminator === "anyOf") {
    for (const req of r.requirements) {
      if (satisfiesRequirement(d, req)) return true;
    }
    return false;
  }
}