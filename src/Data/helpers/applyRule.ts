import { EntityInterface } from "../../interface"
import type Data from "../Data"

type NonFunction = object | string | number | boolean | symbol | bigint | null | undefined;

export function applyRule<T extends NonFunction, E extends EntityInterface>(rule: T | ((entity: E) => T), entity: E) {
  switch (typeof rule) {
    case "bigint":
    case "boolean":
    case "number":
    case "object":
    case "string":
    case "symbol":
    case "undefined":
      return rule;
    default:
      return rule(entity)
  }
}