import type Data from "./Data"
import { Json } from "./Data/helpers/Json"
import { EntityInterface, GroupInterface, ListInterface, NumberFieldInterface, TextFieldInterface } from "./interface"

export type Rule<T, Type = string, Subtype = string> = T | ((
  entity: Type extends "field" ? (
    Subtype extends "text" ? TextFieldInterface
    : Subtype extends "number" ? NumberFieldInterface
    : EntityInterface
  ) : Type extends "group" ? GroupInterface
  : Type extends "list" ? ListInterface
  : EntityInterface,
  data: Data
) => T);

type SingleRequirement =
| (string | number)[]
| [(string | number)[], "exists" | "not exists"]
| [
  (string | number)[],
  | "equals"
  | "not equals"
  | "includes"
  | "is included in",
  Json
];
type AllOf = {
  discriminator: "allOf",
  requirements: (AnyOf | SingleRequirement)[]
}
type AnyOf = {
  discriminator: "anyOf",
  requirements: (AllOf | SingleRequirement)[]
}
export type Requirement = SingleRequirement | AllOf | AnyOf;

type BaseRules<Type = string, Subtype = string> = {
  /** General rule to determine if entity is disabled. */
  disabled?: Rule<boolean, Type, Subtype>;

  /** General rule to determine if entity is invalid. */
  invalid?: Rule<boolean, Type, Subtype>;

  /**
   * Special rule to determine if entity is invalid.
   * If true, entity cannot be empty.
  */
  required?: Rule<boolean, Type, Subtype>;

  /**
   * Special rule to determine if entity is disabled.
   * Entity can require some other entity or entities
   * to not be empty or have some specific value(s).
   */
  requires?: Rule<Requirement, Type, Subtype>;
};

type AbstractEntitySchema<
  Type = string,
  Subtype = string,
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> = {
  type: string;
  default?: any;
  props?: Type extends "group" ?
    GroupProps :
    Type extends "list" ?
    ListProps :
    Type extends "field" ? (
      Subtype extends "text" ?
      TextFieldProps :
      Subtype extends "number" ?
      NumberFieldProps :
      Subtype extends "select" ?
      SelectFieldProps :
      Props
    ) : Props;
};

type AbstractFieldSchema<
  Subtype = string,
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> = AbstractEntitySchema<
  "field",
  Subtype,
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> & {
  type: "field";
  subtype: string;
};

export type TextFieldSchema<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> = AbstractFieldSchema<
  "text",
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> & {
  subtype: "text";
  default?: string;
  rules?: BaseRules<"field", "text"> & {
    /**
     * Special rule to determine if entity is invalid.
     * Number of characters cannot be less than this.
    */
    minlength?: Rule<number, "field", "text">;
    /**
     * Special rule to determine if entity is invalid.
     * Number of characters cannot be more than this.
    */
    maxlength?: Rule<number, "field", "text">;
    /**
     * Special rule to determine if entity is invalid.
     * Number of characters cannot be other than this.
    */
    fixedlength?: Rule<number, "field", "text">;
    /**
     * Special rule to determine if entity is invalid.
     * Value must conform to pattern.
    */
    pattern?: Rule<string | [string, string], "field", "text">;
  };
};

export type NumberFieldSchema<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> = AbstractFieldSchema<
  "number",
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> & {
  subtype: "number";
  default?: number;
  rules?: BaseRules<"field", "number"> & {
    /**
     * Special rule to determine if entity is invalid.
     * Value cannot be less than this.
     * If exclusive is true it cannot be equal to this either.
    */
    min?: Rule<number | {value: number; exclusive: boolean}, "field", "number">;

    /**
     * Special rule to determine if entity is invalid.
     * Value cannot be more than this.
     * If exclusive is true it cannot be equal to this either.
    */
    max?: Rule<number | {value: number; exclusive: boolean}, "field", "number">;

    /**
     * Special rule to determine if entity is invalid.
     * Granularity that the value must adhere to.
     * Either min or 0 select the starting valid value.
    */
    step?: Rule<number, "field", "number">;
  };
};

export type SelectFieldSchema<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> = AbstractFieldSchema<
  "select",
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> & {
  subtype: "select";
  options: Json[];
  default?: Json[];
  rules?: BaseRules<"field", "select"> & {
    /**
     * Special rule to determine if entity is invalid.
     * Selected options cannot be fewer than this.
     * If exclusive is true it cannot be equal to this either.
    */
    minselected?: Rule<number, "field", "select">;

    /**
     * Special rule to determine if entity is invalid.
     * Selected options cannot be more numerous than this.
     * If exclusive is true it cannot be equal to this either.
    */
    maxselected?: Rule<number, "field", "select">;

    /**
     * Special rule to determine if entity is invalid.
     * Number of selected options cannot be other than this.
    */
    fixedselected?: Rule<number, "field", "select">;
  };
};

export type FieldSchema<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> = TextFieldSchema<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> | NumberFieldSchema<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> | SelectFieldSchema<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>;

/** Represents a group of speific distinct things */
export type GroupSchema<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> = AbstractEntitySchema<
  "group",
  string,
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> & {
  type: "group";
  default?: {[key: string]: any};
  contents: {
    [name: string]: EntitySchema<
      Props,
      GroupProps,
      ListProps,
      TextFieldProps,
      NumberFieldProps,
      SelectFieldProps
    >;
  };
  rules?: BaseRules<"group">;
};

/** Represents an arbitrary number of similar things */
export type ListSchema<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> = AbstractEntitySchema<
  "list",
  string,
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> & {
  type: "list";
  default?: any[];
  items: EntitySchema<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  rules?: BaseRules<"list"> & {
    /**
     * Special rule to determine if entity is invalid.
     * Number of items cannot be less than this.
    */
    minitems?: Rule<number, "list">;

    /**
     * Special rule to determine if entity is invalid.
     * Number of items cannot be more than this.
    */
    maxitems?: Rule<number, "list">;

    /**
     * Special rule to determine if entity is invalid.
     * Number of items cannot be other than this.
    */
    fixeditems?: Rule<number, "list">;
  };
};

export type EntitySchema<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> = FieldSchema<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> | GroupSchema<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
> | ListSchema<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps
>