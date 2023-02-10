import { EntityInterface, ListErrors, GroupInterface, ListInterface, ListRules, Value, Errors } from "../interface"
import { ListSchema } from "../schema"
import type Data from "./Data"
import { EntityCreator } from "./Data"
import { applyRule } from "./helpers/applyRule"
import { clone } from "./helpers/clone"
// import didValChange from "./helpers/didValChange"
import { equals, isJson } from "./helpers/Json"
import { getIndex } from "./methods/getIndex"
import { getName } from "./methods/getName"
import { getPath } from "./methods/getPath"
import { satisfiesRequirement } from "./methods/satisfiesRequirement"
import { tread } from "./methods/tread"

class List implements ListInterface {
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

  conforms(value: any): value is Value[] {
    // Check type
    if (!Array.isArray(value)) return false;

    // Check items
    for (const item of this.items) {
      if (!item.valid) return false;
    }

    // Check rules
    if (!this.rules) return true;
    if (this.rules.invalid) return false;
    if (this.rules.required && this.empty) return false;
    if (this.empty) return true;

    // Check structure here after making sure it can be empty
    if (value.length !== this.items.length) return false;

    // Continue checking rules
    if (this.rules.minitems && this.items.length < this.rules.minitems) return false;
    if (this.rules.maxitems && this.items.length > this.rules.maxitems) return false;
    if (this.rules.fixeditems && this.items.length !== this.rules.fixeditems) return false;

    return true;
  }

  get errors() {
    const errors: ListErrors = {};

    // Check type
    if (!Array.isArray(this.value)) errors.type = true;

    // Check items
    const items: (Errors | undefined)[] = [];
    for (const item of this.items) {
      items.push(item.errors);
      if (item.errors) errors.items = items;
    }

    // Check rules
    if (this.rules) {
      if (this.rules.invalid) errors.invalid = true;
      if (this.rules.required && this.empty) errors.required = true;
      if (!this.empty) {
        // Check structure here after making sure it can be empty
        if (this.value.length !== this.items.length) errors.length = true;

        // Continue checking rules
        if (this.rules.minitems && this.items.length < this.rules.minitems) errors.minitems = true;
        if (this.rules.maxitems && this.items.length > this.rules.maxitems) errors.maxitems = true;
        if (this.rules.fixeditems && this.items.length !== this.rules.fixeditems) errors.fixeditems = true;
      }
    }

    return Object.values(errors).some(v => !!v === true) ? errors : undefined;
  }

  get empty() {
    for (const item of this.items) {
      if (!item.empty) return false;
    }

    return true;
  }

  clear() {
    this._removeAll();
    for (const item of this.items) {
      item.clear();
    }
  }

  reset() {
    if (this.schema.default) {
      const v = typeof this.schema.default === "function" ? this.schema.default(this) : this.schema.default;
      this.value = v;
    }
    else this.clear();
    for (const item of this.items) {
      item.reset();
    }
  }

  set value(v) {
    if (!Array.isArray(v)) {
      // const wasEmpty = this.empty;
      this.clear();
      // if (wasEmpty) this.data.onFieldChange?.(this);
      return;
    }

    // const prevVal = this.value;

    const itemsDiff = v.length - this.items.length;
    const add = itemsDiff > 0;

    if (add) {
      for (let i = 0; i < Math.abs(itemsDiff); i++) {
        this._addItem();
      }
    } else {
      for (let i = 0; i < Math.abs(itemsDiff); i++) {
        this._removeItem();
      }
    }

    // Set children
    let i = 0;
    for (const itemValue of v) {
      const item = this.items[i];
      if (item) item.value = itemValue;
      i++;
    }

    // // Check if this.data.onFieldChange must be called
    // if (this.data.onFieldChange && didValChange(this, prevVal)) {
    //   this.data.onFieldChange(this)
    // }
  }
  /** alias for value setter */
  set(value: any) {this.value = value; return this;}
  get value() {
    const v: any = [];
    let i = 0;
    for (const item of this.items) {
      if (!item.disabled) v[i] = item.value;
      i++;
    }
    return v;
  }
  equals(value: any): boolean {
    const v = this.value;
    if (!isJson(v) || !isJson(value)) return false;
    return equals(v, value);
  }

  private _items: EntityInterface[] = [];
  get items(): readonly EntityInterface[] {
    return this._items;
  }

  get rules(): ListRules {
    if (!this.schema.rules) return undefined;
  
    return {
      disabled: applyRule(this.schema.rules.disabled, this),
      invalid: applyRule(this.schema.rules.invalid, this),
      required: applyRule(this.schema.rules.required, this),
      minitems: applyRule(this.schema.rules.minitems, this),
      maxitems: applyRule(this.schema.rules.maxitems, this),
      fixeditems: applyRule(this.schema.rules.fixeditems, this)
    }
  };

  private _addItem(i?: number) {
    // Ensure not more than max items.
    if (this.rules?.maxitems && this.rules.maxitems >= this.items.length) {
      return;
    }
    if (this.rules?.fixeditems && this.rules.fixeditems >= this.items.length) {
      return;
    }

    const itemSchema = this.schema.items;
    const items = this._items;
    i = i ?? this.items.length;

    items.splice(i, 0, this._createEntity({schema: itemSchema, data: this.data, container: this}));
  }

  private _removeItem(i?: number) {
    // Ensure not less than min items.
    if (this.rules?.minitems && this.rules.minitems <= this.items.length) {
      return;
    }
    if (this.rules?.fixeditems && this.rules.fixeditems <= this.items.length) {
      return;
    }

    i = i ?? (this._items.length - 1);
    this._items.splice(i, 1);
  }

  private _removeAll() {
    // Ensure no less than min
    const min = typeof this.rules?.fixeditems === "number" ? this.rules?.fixeditems : this.rules?.minitems;
    this._items.splice(min ?? 0, this._items.length);
  }

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

  get list() {return this}
  group = undefined;
  text = undefined;
  number = undefined;
  select = undefined;

  props?: {[key: string]: any};

  readonly schema: ListSchema;
  readonly data: Data;
  readonly container?: ListInterface | GroupInterface;

  private _createEntity;
  constructor(init: {
    schema: ListSchema;
    data: Data;
    container?: ListInterface | GroupInterface;
    createEntity: EntityCreator;
  }) {
    this.schema = init.schema;
    this.data = init.data;
    this.container = init.container;
    this._createEntity = init.createEntity;
    this.props = clone(init.schema.props);

    if (this.rules?.minitems) {
      for (let i = 0; i < this.rules.minitems; i++) {
        this._addItem();
      }
    }

    if (this.schema.default) this.reset();

    this.data.onEntityConstruct?.(this);
  }
}

export default List