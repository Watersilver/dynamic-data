import type Data from "./Data";
import { Json } from "./Data/helpers/Json";
import { GroupSchema, ListSchema, NumberFieldSchema, SelectFieldSchema, TextFieldSchema } from "./schema";

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

export interface AbstractEntityInterface<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> {
  clear(): void;
  reset(): void;
  equals(value: any): boolean;
  tread(): EntityInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  tread(path: string): EntityInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  tread(path: (string | number)[]): EntityInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  tread(backtrack: number): EntityInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  tread(backtrack: number, path: string): EntityInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  tread(backtrack: number, path: (string | number)[]): EntityInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  readonly disabled: boolean;
  readonly valid: boolean;
  readonly empty: boolean;
  readonly data: Data<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  readonly name?: string;
  readonly index?: number;
  readonly root: boolean;
  value: any;
  readonly path: (string | number)[];
  readonly container?: ListInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | GroupInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  readonly group: GroupInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  readonly list: ListInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  readonly number: NumberFieldInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  readonly text: TextFieldInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
  readonly select: SelectFieldInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  > | undefined;
};
export function isGroup<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
>(e: EntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>): e is GroupInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> {
  return e.schema.type === "group"
}
export interface GroupInterface<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> extends AbstractEntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> {
  props: GroupProps;
  readonly schema: GroupSchema<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  readonly rules: GroupRules;
  readonly errors?: GroupErrors;
  readonly contents: {readonly [name: string]: EntityInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >};
  set(value: any): GroupInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  conforms(value: unknown): value is {[key: string]: Value};
};
export function isList<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
>(e: EntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>): e is ListInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> {
  return e.schema.type === "list"
};
export interface ListInterface<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> extends AbstractEntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> {
  props: ListProps;
  readonly schema: ListSchema<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  readonly rules: ListRules;
  readonly errors?: ListErrors;
  readonly items: readonly EntityInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >[];
  set(value: any): ListInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  conforms(value: unknown): value is Value[];
};
export function isTextField<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
>(e: EntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>): e is TextFieldInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
  > {
  return e.schema.type === "field" && e.schema.subtype === "text"
};
export interface TextFieldInterface<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> extends AbstractEntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> {
  props: TextFieldProps;
  readonly schema: TextFieldSchema<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  readonly rules: TextFieldRules;
  readonly errors?: TextFieldErrors;
  set(value: any): TextFieldInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  conforms(value: unknown): value is string | undefined;
};
export function isNumberField<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
>(e: EntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>): e is NumberFieldInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> {
  return e.schema.type === "field" && e.schema.subtype === "number"
};
export interface NumberFieldInterface<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> extends AbstractEntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> {
  props: NumberFieldProps;
  readonly schema: NumberFieldSchema<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  readonly rules: NumberFieldRules;
  readonly errors?: NumberFieldErrors;
  set(value: any): NumberFieldInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  conforms(value: unknown): value is number | undefined;
};
export function isSelectField<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
>(e: EntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>): e is SelectFieldInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> {
  return e.schema.type === "field" && e.schema.subtype === "select"
};
export interface SelectFieldInterface<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> extends AbstractEntityInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> {
  props: SelectFieldProps;
  readonly schema: SelectFieldSchema<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  readonly rules: SelectFieldRules;
  readonly errors?: SelectFieldErrors;
  set(value: any): SelectFieldInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  conforms(value: unknown): value is Json[] | undefined;
};
export type EntityInterface<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> =
| GroupInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>
| ListInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>
| TextFieldInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>
| NumberFieldInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>
| SelectFieldInterface<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>;
