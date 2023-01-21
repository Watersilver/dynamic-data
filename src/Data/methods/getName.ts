import { EntityInterface, isGroup } from "../../interface";

export function getName(ent: EntityInterface) {
  if (!ent.container) return undefined;
  if (isGroup(ent.container)) {
    for (const [key, entry] of Object.entries(ent.container.contents)) {
      if (entry === ent) return key;
    }
  }
  return undefined;
}