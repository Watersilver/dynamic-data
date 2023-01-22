import { EntityInterface, GroupInterface, ListInterface, NumberFieldErrors, NumberFieldInterface, NumberFieldRules } from "../interface"
import { NumberFieldSchema } from "../schema"
import type Data from "./Data"
import { applyRule } from "./helpers/applyRule"
import { clone } from "./helpers/clone"
import didValChange from "./helpers/didValChange"
import { equals, isJson } from "./helpers/Json"
import { getIndex } from "./methods/getIndex"
import { getName } from "./methods/getName"
import { getPath } from "./methods/getPath"
import { satisfiesRequirement } from "./methods/satisfiesRequirement"
import { tread } from "./methods/tread"

class NumberField implements NumberFieldInterface {
  get path() {
    const p = getPath(this);
    return p;
  }

  get disabled() {
    if (this.rules) {
      if (this.rules.disabled) return true;

      if (this.rules.requires && !satisfiesRequirement(this.data, this.rules.requires)) {
        return true;
      }
    }

    return false;
  }

  get valid() {
    return this.conforms(this.value)
  }

  conforms(value: any): value is number {
    // Check type
    if (value !== null && typeof value !== "number") return false;
    if (Number.isNaN(value)) return false;

    // Check rules
    if (!this.rules) return true;
    if (this.rules.invalid) return false;
    if (this.rules.required && this.empty) return false;
    if (this.empty) return true;
    if (this.rules.min) {
      if (typeof this.rules.min === "object") {
        if (this.rules.min.exclusive) {
          if (this.rules.min.value >= value) return false;
        } else {
          if (this.rules.min.value > value) return false;
        }
      } else {
        if (this.rules.min > value) return false;
      }
    }
    if (this.rules.max) {
      if (typeof this.rules.max === "object") {
        if (this.rules.max.exclusive) {
          if (this.rules.max.value <= value) return false;
        } else {
          if (this.rules.max.value < value) return false;
        }
      } else {
        if (this.rules.max < value) return false;
      }
    }
    if (this.rules.step) {
      if (!this.rules.min) {
        if (value % this.rules.step !== 0) return false;
      } else {
        const min = typeof this.rules.min === "object" ? this.rules.min.value : this.rules.min;
        if ((value - min) % this.rules.step !== 0) return false;
      }
    }

    return true;
  }

  get errors() {
    const errors: NumberFieldErrors = {};
    // Check type
    if (this.value !== null && typeof this.value !== "number") errors.type = true;
    if (Number.isNaN(this.value)) errors.value = true;

    // Check rules
    if (this.rules) {
      if (this.rules.invalid) errors.invalid = true;
      if (this.rules.required && this.empty) errors.required = true;
      if (!this.empty) {
        if (this.rules.min) {
          if (typeof this.rules.min === "object") {
            if (this.rules.min.exclusive) {
              if (this.rules.min.value >= this.value) errors.min = true;
            } else {
              if (this.rules.min.value > this.value) errors.min = true;
            }
          } else {
            if (this.rules.min > this.value) errors.min = true;
          }
        }
        if (this.rules.max) {
          if (typeof this.rules.max === "object") {
            if (this.rules.max.exclusive) {
              if (this.rules.max.value <= this.value) errors.max = true;
            } else {
              if (this.rules.max.value < this.value) errors.max = true;
            }
          } else {
            if (this.rules.max < this.value) errors.max = true;
          }
        }
        if (this.rules.step) {
          if (!this.rules.min) {
            if (this.value % this.rules.step !== 0) errors.step = true;
          } else {
            const min = typeof this.rules.min === "object" ? this.rules.min.value : this.rules.min;
            if ((this.value - min) % this.rules.step !== 0) errors.step = true;
          }
        }
      }
    }

    return Object.values(errors).some(v => v === true) ? errors : undefined;
  }

  get empty() {
    return this.value === null;
  }
  clear() {this.value = null}
  reset() {
    if (this.schema.default) {
      const v = typeof this.schema.default === "function" ? this.schema.default(this) : this.schema.default;
      this.value = v;
    } else this.clear();
  }

  private _v: any = null;
  set value(v) {
    const prevVal = this.value;
    this._v = v === null ? null : Number(v);

    // Check if this.data.onFieldChange must be called
    if (this.data.onFieldChange && didValChange(this, prevVal)) {
      this.data.onFieldChange(this)
    }
  }
  /** alias for value setter */
  set(value: any) {this.value = value; return this;}
  get value() { return this._v; }
  equals(value: any): boolean {
    if (!isJson(this._v) || !isJson(value)) return false;
    return equals(this._v, value);
  }

  get rules(): NumberFieldRules {
    if (!this.schema.rules) return undefined;

    return {
      disabled: applyRule(this.schema.rules.disabled, this),
      invalid: applyRule(this.schema.rules.invalid, this),
      required: applyRule(this.schema.rules.required, this),
      requires: applyRule(this.schema.rules.requires, this),
      min: applyRule(this.schema.rules.min, this),
      max: applyRule(this.schema.rules.max, this),
      step: applyRule(this.schema.rules.step, this)
    }
  };

  get index(): number | undefined {
    return getIndex(this);
  }
  get name(): string | undefined {
    return getName(this);
  }
  get root() {
    return !!this.container;
  }

  tread(): EntityInterface | undefined;
  tread(path: string): EntityInterface | undefined;
  tread(path: (string | number)[]): EntityInterface | undefined;
  tread(backtrack: number): EntityInterface | undefined;
  tread(backtrack: number, path: string): EntityInterface | undefined;
  tread(backtrack: number, path: (string | number)[]): EntityInterface | undefined;
  tread(backtrack?: number | string | (string | number)[], path?: string | (string | number)[]) {
    return tread(this, backtrack, path);
  }

  get number() {return this}
  group = undefined;
  list = undefined;
  text = undefined;
  select = undefined;

  get props() {
    return this._props;
  }
  set props(p: any) {
    this._props = p;
  }

  readonly schema: NumberFieldSchema;
  readonly data: Data;
  readonly container?: ListInterface | GroupInterface;
  private _props: any;

  constructor(init: {
    schema: NumberFieldSchema;
    data: Data;
    container?: ListInterface | GroupInterface;
  }) {
    this.schema = init.schema;
    this.data = init.data;
    this.container = init.container;
    this._props = clone(init.schema.props);

    if (this.schema.default) this.reset();

    this.data.onEntityConstruct?.(this);
  }
}

export default NumberField