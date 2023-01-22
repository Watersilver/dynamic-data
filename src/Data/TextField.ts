import { EntityInterface, GroupInterface, ListInterface, TextFieldErrors, TextFieldInterface, TextFieldRules } from "../interface"
import { TextFieldSchema } from "../schema"
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

class TextField implements TextFieldInterface {
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

  conforms(value: any): value is string {
    // Check type
    if (typeof value !== "string") return false;

    // Check rules
    if (!this.rules) return true;
    if (this.rules.invalid) return false;
    if (this.rules.required && this.empty) return false;
    if (this.empty) return true;
    if (this.rules.minlength && this.rules.minlength > value.length) return false;
    if (this.rules.maxlength && this.rules.maxlength < value.length) return false;
    if (this.rules.fixedlength && this.rules.fixedlength !== value.length) return false;
    if (this.rules.pattern) {
      if (Array.isArray(this.rules.pattern)) {
        const pattern = this.rules.pattern[0];
        const flags = this.rules.pattern[1];
        if (!new RegExp(pattern, flags).test(value)) return false;
      } else {
        if (!new RegExp(this.rules.pattern).test(value)) return false;
      }
    }

    return true;
  }

  get errors() {
    const errors: TextFieldErrors = {};
    // Check type
    if (typeof this.value !== "string") errors.type = true;

    // Check rules
    if (this.rules) {
      if (this.rules.invalid) errors.invalid = true;
      if (this.rules.required && this.empty) errors.required = true;
      if (!this.empty) {
        if (this.rules.minlength && this.rules.minlength > this.value.length) errors.minlength = true;
        if (this.rules.maxlength && this.rules.maxlength < this.value.length) errors.maxlength = true;
        if (this.rules.fixedlength && this.rules.fixedlength !== this.value.length) errors.fixedlength = true;
        if (this.rules.pattern) {
          if (Array.isArray(this.rules.pattern)) {
            const pattern = this.rules.pattern[0];
            const flags = this.rules.pattern[1];
            if (!new RegExp(pattern, flags).test(this.value)) errors.pattern = true;
          } else {
            if (!new RegExp(this.rules.pattern).test(this.value)) errors.pattern = true;
          }
        }
      }
    }

    return Object.values(errors).some(v => v === true) ? errors : undefined;
  }

  get empty() {
    return this.value === "";
  }
  clear() {this.value = ""}
  reset() {
    if (this.schema.default) {
      const v = typeof this.schema.default === "function" ? this.schema.default(this) : this.schema.default;
      this.value = v;
    } else this.clear();
  }

  private _v: any = "";
  set value(v) {
    const prevVal = this.value;
    this._v = String(v);

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

  get rules(): TextFieldRules {
    if (!this.schema.rules) return undefined;

    return {
      disabled: applyRule(this.schema.rules.disabled, this),
      invalid: applyRule(this.schema.rules.invalid, this),
      required: applyRule(this.schema.rules.required, this),
      requires: applyRule(this.schema.rules.requires, this),
      minlength: applyRule(this.schema.rules.minlength, this),
      maxlength: applyRule(this.schema.rules.maxlength, this),
      fixedlength: applyRule(this.schema.rules.fixedlength, this),
      pattern: applyRule(this.schema.rules.pattern, this)
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

  get text() {return this}
  group = undefined;
  list = undefined;
  number = undefined;
  select = undefined;

  get props() {
    return this._props;
  }
  set props(p: any) {
    this._props = p;
  }

  readonly schema: TextFieldSchema;
  readonly data: Data;
  readonly container?: ListInterface | GroupInterface;
  private _props: any;

  constructor(init: {
    schema: TextFieldSchema;
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

export default TextField