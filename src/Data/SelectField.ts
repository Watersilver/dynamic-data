import { EntityInterface, GroupInterface, ListInterface, SelectFieldErrors, SelectFieldInterface, SelectFieldRules } from "../interface";
import { SelectFieldSchema } from "../schema";
import type Data from "./Data";
import { applyRule } from "./helpers/applyRule";
import { clone } from "./helpers/clone";
import didValChange from "./helpers/didValChange";
import { equals, isJson, Json } from "./helpers/Json";
import { getIndex } from "./methods/getIndex";
import { getName } from "./methods/getName";
import { getPath } from "./methods/getPath";
import { satisfiesRequirement } from "./methods/satisfiesRequirement";
import { tread } from "./methods/tread";

class SelectField implements SelectFieldInterface {
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

  conforms(value: any): value is Json[] {
    // Check type
    if (!Array.isArray(value)) return false;
    for (const selected of value) {
      if (!isJson(selected)) return false;
      let valid = false;
      for (const option of this.schema.options) {
        if (equals(option, selected)) {
          valid = true;
          break;
        }
      }
      if (!valid) return false;
    }

    // Check rules
    if (!this.rules) return true;
    if (this.rules.invalid) return false;
    if (this.rules.required && this.empty) return false;
    if (this.empty) return true;
    if (this.rules.minselected && this.rules.minselected > value.length) return false;
    if (this.rules.maxselected && this.rules.maxselected < value.length) return false;
    if (this.rules.fixedselected && this.rules.fixedselected !== value.length) return false;

    return true;
  }

  get errors() {
    const errors: SelectFieldErrors = {};
    // Check type
    if (!Array.isArray(this.value)) errors.type = true;
    for (const selected of this.value) {
      if (!isJson(selected)) {
        errors.type = true;
        break;
      }
      let valid = false;
      for (const option of this.schema.options) {
        if (equals(option, selected)) {
          valid = true;
          break;
        }
      }
      if (!valid) errors.type = true;
    }

    // Check rules
    if (this.rules) {
      if (this.rules.invalid) errors.invalid = true;
      if (this.rules.required && this.empty) errors.required = true;
      if (!this.empty) {
        if (this.rules.minselected && this.rules.minselected > this.value.length) errors.minselected = true;
        if (this.rules.maxselected && this.rules.maxselected < this.value.length) errors.maxselected = true;
        if (this.rules.fixedselected && this.rules.fixedselected !== this.value.length) errors.fixedselected = true;
      }
    }

    return Object.values(errors).some(v => v === true) ? errors : undefined;
  }

  get empty() {
    return Array.isArray(this.value) && this.value?.length === 0;
  }
  clear() {this.value = []}
  reset() {this.value = this.schema.default ?? []}

  private _v: any = [];
  set value(v) {
    const prevVal = this.value;
    this._v = v;

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

  get rules(): SelectFieldRules {
    if (!this.schema.rules) return undefined;

    return {
      disabled: applyRule(this.schema.rules.disabled, this, this.data),
      invalid: applyRule(this.schema.rules.invalid, this, this.data),
      required: applyRule(this.schema.rules.required, this, this.data),
      requires: applyRule(this.schema.rules.requires, this, this.data),
      minselected: applyRule(this.schema.rules.minselected, this, this.data),
      maxselected: applyRule(this.schema.rules.maxselected, this, this.data),
      fixedselected: applyRule(this.schema.rules.fixedselected, this, this.data)
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

  get select() {return this}
  group = undefined;
  list = undefined;
  text = undefined;
  number = undefined;

  get props() {
    return this._props;
  }
  set props(p: any) {
    this._props = p;
  }

  readonly schema: SelectFieldSchema;
  readonly data: Data;
  readonly container?: ListInterface | GroupInterface;
  private _props: any;

  constructor(init: {
    schema: SelectFieldSchema;
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

export default SelectField