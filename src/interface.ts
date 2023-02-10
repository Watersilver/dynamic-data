import type Data from "./Data"
import { Json } from "./Data/helpers/Json"
import { GroupSchema, ListSchema, NumberFieldSchema, SelectFieldSchema, TextFieldSchema } from "./schema"

export type Value = number | string | {[key: string]: Value} | Value[] | undefined;

export type GroupRules = {
  [rule in keyof NonNullable<GroupSchema["rules"]>]: Exclude<NonNullable<GroupSchema["rules"]>[rule], Function>
} | undefined;
export type GroupErrors = {
  [error in keyof NonNullable<GroupRules> | "type" | "value" | "keys"]?: boolean;
} & {
  contents?: {[name: string]: Errors}
}

export type ListRules = {
  [rule in keyof NonNullable<ListSchema["rules"]>]: Exclude<NonNullable<ListSchema["rules"]>[rule], Function>
} | undefined;
export type ListErrors = {
  [error in keyof NonNullable<ListRules> | "type" | "length"]?: boolean;
} & {
  items?: (Errors | undefined)[]
}

export type TextFieldRules = {
  [rule in keyof NonNullable<TextFieldSchema["rules"]>]: Exclude<NonNullable<TextFieldSchema["rules"]>[rule], Function>
} | undefined;
export type TextFieldErrors = {
  [error in keyof NonNullable<TextFieldRules> | "type"]?: boolean;
}

export type NumberFieldRules = {
  [rule in keyof NonNullable<NumberFieldSchema["rules"]>]: Exclude<NonNullable<NumberFieldSchema["rules"]>[rule], Function>
} | undefined;
export type NumberFieldErrors = {
  [error in keyof NonNullable<NumberFieldRules> | "type" | "value"]?: boolean;
}

export type SelectFieldRules = {
  [rule in keyof NonNullable<SelectFieldSchema["rules"]>]: Exclude<NonNullable<SelectFieldSchema["rules"]>[rule], Function>
} | undefined;
export type SelectFieldErrors = {
  [error in keyof NonNullable<SelectFieldRules> | "type"]?: boolean;
}

export type Errors = GroupErrors | ListErrors | TextFieldErrors | NumberFieldErrors | SelectFieldErrors;

export interface AbstractEntityInterface {
  clear(): void;
  reset(): void;
  equals(value: any): boolean;
  tread(): EntityInterface | undefined;
  tread(path: string): EntityInterface | undefined;
  tread(path: (string | number)[]): EntityInterface | undefined;
  tread(backtrack: number): EntityInterface | undefined;
  tread(backtrack: number, path: string): EntityInterface | undefined;
  tread(backtrack: number, path: (string | number)[]): EntityInterface | undefined;
  readonly disabled: boolean;
  readonly valid: boolean;
  readonly empty: boolean;
  readonly data: Data;
  readonly name?: string;
  readonly index?: number;
  readonly root: boolean;
  value: any;
  props?: any;
  readonly path: (string | number)[];
  readonly container?: ListInterface | GroupInterface;
  readonly group: GroupInterface | undefined;
  readonly list: ListInterface | undefined;
  readonly number: NumberFieldInterface | undefined;
  readonly text: TextFieldInterface | undefined;
  readonly select: SelectFieldInterface | undefined;
};
export function isGroup(e: EntityInterface): e is GroupInterface {
  return e.schema.type === "group"
}
export interface GroupInterface extends AbstractEntityInterface {
  readonly schema: GroupSchema;
  readonly rules: GroupRules;
  readonly errors?: GroupErrors;
  readonly contents: {readonly [name: string]: EntityInterface};
  set(value: any): GroupInterface;
  conforms(value: unknown): value is {[key: string]: Value};
};
export function isList(e: EntityInterface): e is ListInterface {
  return e.schema.type === "list"
};
export interface ListInterface extends AbstractEntityInterface {
  readonly schema: ListSchema;
  readonly rules: ListRules;
  readonly errors?: ListErrors;
  readonly items: readonly EntityInterface[];
  set(value: any): ListInterface;
  conforms(value: unknown): value is Value[];
};
export function isTextField(e: EntityInterface): e is TextFieldInterface {
  return e.schema.type === "field" && e.schema.subtype === "text"
};
export interface TextFieldInterface extends AbstractEntityInterface {
  readonly schema: TextFieldSchema;
  readonly rules: TextFieldRules;
  readonly errors?: TextFieldErrors;
  set(value: any): TextFieldInterface;
  conforms(value: unknown): value is string | undefined;
};
export function isNumberField(e: EntityInterface): e is NumberFieldInterface {
  return e.schema.type === "field" && e.schema.subtype === "number"
};
export interface NumberFieldInterface extends AbstractEntityInterface {
  readonly schema: NumberFieldSchema;
  readonly rules: NumberFieldRules;
  readonly errors?: NumberFieldErrors;
  set(value: any): NumberFieldInterface;
  conforms(value: unknown): value is number | undefined;
};
export function isSelectField(e: EntityInterface): e is SelectFieldInterface {
  return e.schema.type === "field" && e.schema.subtype === "select"
};
export interface SelectFieldInterface extends AbstractEntityInterface {
  readonly schema: SelectFieldSchema;
  readonly rules: SelectFieldRules;
  readonly errors?: SelectFieldErrors;
  set(value: any): SelectFieldInterface;
  conforms(value: unknown): value is Json[] | undefined;
};
export type EntityInterface =
| GroupInterface
| ListInterface
| TextFieldInterface
| NumberFieldInterface
| SelectFieldInterface;
