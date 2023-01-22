import { EntityInterface, GroupErrors, GroupInterface, GroupRules, ListInterface, Value } from "../interface"
import { GroupSchema } from "../schema"
import type Data from "./Data"
import { EntityCreator } from "./Data"
import { applyRule } from "./helpers/applyRule"
import { arrIncludes } from "./helpers/arrayUtil"
import { clone } from "./helpers/clone"
// import didValChange from "./helpers/didValChange"
import { equals, isJson } from "./helpers/Json"
import { getIndex } from "./methods/getIndex"
import { getName } from "./methods/getName"
import { getPath } from "./methods/getPath"
import { satisfiesRequirement } from "./methods/satisfiesRequirement"
import { tread } from "./methods/tread"

class Group implements GroupInterface {
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
    return this.conforms(this.value);
  }

  conforms(value: any): value is {[key: string]: Value} {
    // Check type
    if (typeof value !== "object" || !value) return false;

    // Check structure
    if (!arrIncludes(
      Object.keys(this.contents),
      Object.keys(value)
    )) return false;

    // Check contents
    for (const item of Object.values(this.contents)) {
      if (!item.valid) return false;
    }

    // Check rules
    if (!this.rules) return true;
    if (this.rules.invalid) return false;
    if (this.rules.required && this.empty) return false;

    return true;
  }

  get errors() {
    const errors: GroupErrors = {};

    // Check type
    if (typeof this.value !== "object") errors.type = true;
    if (this.value === null) errors.value = true;

    // Check structure
    if (!arrIncludes(
      Object.keys(this.contents),
      Object.keys(this.value)
    )) {
      errors.keys = true;
    }

    // Check contents
    for (const [name, item] of Object.entries(this.contents)) {
      if (item.errors) {
        errors.contents = errors.contents || {};
        errors.contents[name] = item.errors;
      }
    }

    // Check rules
    if (this.rules) {
      if (this.rules.invalid) errors.invalid = true;
      if (this.rules.required && this.empty) errors.required = true;
    }

    return Object.values(errors).some(v => !!v === true) ? errors : undefined;
  }

  get empty() {
    for (const item of Object.values(this.contents)) {
      if (!item.empty) return false;
    }

    return true;
  }

  clear() {
    for (const item of Object.values(this.contents)) {
      item.clear();
    }
  }

  reset() {
    if (this.schema.default) {
      const v = typeof this.schema.default === "function" ? this.schema.default(this) : this.schema.default;
      this.value = v;
    }
    else this.clear();
    for (const item of Object.values(this.contents)) {
      item.reset();
    }
  }

  set value(v) {
    if (!v || typeof v !== "object") {
      // const wasEmpty = this.empty;
      this.clear();
      // if (wasEmpty) this.data.onFieldChange?.(this);
      return;
    }

    // const prevVal = this.value;

    const keysSet: Set<string> = new Set();

    // Set children
    for (const [key, value] of Object.entries(v)) {
      const item = this.contents[key];
      if (item) {
        keysSet.add(key);
        item.value = value;
      }
    }

    // Clear remaining children
    for (const [key, item] of Object.entries(this.contents)) {
      if (!keysSet.has(key)) item.clear();
    }

    // // Check if this.data.onFieldChange must be called
    // if (this.data.onFieldChange && didValChange(this, prevVal)) {
    //   this.data.onFieldChange(this)
    // }
  }
  /** alias for value setter */
  set(value: any) {this.value = value; return this;}
  get value() {
    const v: any = {};
    for (const [key, item] of Object.entries(this.contents)) {
      if (!item.disabled && !item.empty) v[key] = item.value;
    }
    return v;
  }
  equals(value: any): boolean {
    const v = this.value;
    if (!isJson(v) || !isJson(value)) return false;
    return equals(v, value);
  }

  get rules(): GroupRules {
    if (!this.schema.rules) return undefined;

    return {
      disabled: applyRule(this.schema.rules.disabled, this),
      invalid: applyRule(this.schema.rules.invalid, this),
      required: applyRule(this.schema.rules.required, this),
      requires: applyRule(this.schema.rules.requires, this)
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

  get group() {return this}
  list = undefined;
  text = undefined;
  number = undefined;
  select = undefined;

  get props() {
    return this._props;
  }
  set props(p: any) {
    this._props = p;
  }

  readonly schema: GroupSchema;
  readonly data: Data;
  readonly container?: ListInterface | GroupInterface;
  readonly contents: { [name: string]: EntityInterface; };
  private _props: any;

  constructor(init: {
    schema: GroupSchema;
    data: Data;
    container?: ListInterface | GroupInterface;
    createEntity: EntityCreator;
  }) {
    this.schema = init.schema;
    this.data = init.data;
    this.container = init.container;
    this._props = clone(init.schema.props);

    const contents: { [name: string]: EntityInterface; } = {};
    for (const [name, item] of Object.entries(this.schema.contents)) {
      contents[name] = init.createEntity({data: this.data, container: this, schema: item})
    }
    this.contents = contents;

    if (this.schema.default) this.reset();

    this.data.onEntityConstruct?.(this);
  }
}

export default Group