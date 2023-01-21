import { EntityInterface } from "../../interface";

export function getIndex(ent: EntityInterface) {
  if (!ent.container) return undefined;
  const i = ent.container.list?.items.indexOf(ent);
  return i === -1 ? undefined : i;
}