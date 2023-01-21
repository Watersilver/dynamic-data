import { EntityInterface } from "../../interface";
import { equals } from "./Json";

export default function didValChange(e: EntityInterface, prevVal: any) {
  const val = e.value;
  const valid = e.conforms(val);
  const wasValid = e.conforms(prevVal);
  // If both valid check if changed.
  if (valid && wasValid) {
    if (!equals(val, prevVal)) return true;
    return false;
  }
  // If both invalid consider it unchanged.
  else if (!wasValid && !valid) return false;
  // All other cases changed.
  return true;
}