import { Json } from "./Data/helpers/Json"
import { EntityInterface, GroupInterface, ListInterface, NumberFieldInterface, SelectFieldInterface, TextFieldInterface } from "./interface"

type Rule<
  Props,
  GroupProps,
  ListProps,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps,
  T = any,
  Type = string,
  Subtype = string
> = T | ((
  entity: Type extends "field" ? (
    Subtype extends "text" ? TextFieldInterface<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps>
    : Subtype extends "number" ? NumberFieldInterface<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps>
    : Subtype extends "select" ? SelectFieldInterface<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps>
    : EntityInterface
  ) : Type extends "group" ? GroupInterface<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps>
  : Type extends "list" ? ListInterface<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps>
  : EntityInterface
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

type BaseRules<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, Type = string, Subtype = string> = {
  /** General rule to determine if entity is disabled. */
  disabled?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, boolean, Type, Subtype>;

  /** General rule to determine if entity is invalid. */
  invalid?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, boolean, Type, Subtype>;

  /**
   * Special rule to determine if entity is invalid.
   * If true, entity cannot be empty.
  */
  required?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, boolean, Type, Subtype>;

  /**
   * Special rule to determine if entity is disabled.
   * Entity can require some other entity or entities
   * to not be empty or have some specific value(s).
   */
  requires?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, Requirement, Type, Subtype>;
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
  default?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, string, "field", "text">;
  rules?: BaseRules<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, "field", "text"> & {
    /**
     * Special rule to determine if entity is invalid.
     * Number of characters cannot be less than this.
    */
    minlength?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "field", "text">;
    /**
     * Special rule to determine if entity is invalid.
     * Number of characters cannot be more than this.
    */
    maxlength?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "field", "text">;
    /**
     * Special rule to determine if entity is invalid.
     * Number of characters cannot be other than this.
    */
    fixedlength?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "field", "text">;
    /**
     * Special rule to determine if entity is invalid.
     * Value must conform to pattern.
    */
    pattern?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, string | [string, string], "field", "text">;
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
  default?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "field", "number">;
  rules?: BaseRules<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, "field", "number"> & {
    /**
     * Special rule to determine if entity is invalid.
     * Value cannot be less than this.
     * If exclusive is true it cannot be equal to this either.
    */
    min?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number | {value: number; exclusive: boolean}, "field", "number">;

    /**
     * Special rule to determine if entity is invalid.
     * Value cannot be more than this.
     * If exclusive is true it cannot be equal to this either.
    */
    max?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number | {value: number; exclusive: boolean}, "field", "number">;

    /**
     * Special rule to determine if entity is invalid.
     * Granularity that the value must adhere to.
     * Either min or 0 select the starting valid value.
    */
    step?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "field", "number">;
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
  default?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, Json[], "field", "select">;
  rules?: BaseRules<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, "field", "select"> & {
    /**
     * Special rule to determine if entity is invalid.
     * Selected options cannot be fewer than this.
     * If exclusive is true it cannot be equal to this either.
    */
    minselected?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "field", "select">;

    /**
     * Special rule to determine if entity is invalid.
     * Selected options cannot be more numerous than this.
     * If exclusive is true it cannot be equal to this either.
    */
    maxselected?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "field", "select">;

    /**
     * Special rule to determine if entity is invalid.
     * Number of selected options cannot be other than this.
    */
    fixedselected?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "field", "select">;
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
  default?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, {[key: string]: any}, "group">;
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
  rules?: BaseRules<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, "group">;
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
  default?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, any[], "list">;
  items: EntitySchema<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  rules?: BaseRules<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, "list"> & {
    /**
     * Special rule to determine if entity is invalid.
     * Number of items cannot be less than this.
    */
    minitems?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "list">;

    /**
     * Special rule to determine if entity is invalid.
     * Number of items cannot be more than this.
    */
    maxitems?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "list">;

    /**
     * Special rule to determine if entity is invalid.
     * Number of items cannot be other than this.
    */
    fixeditems?: Rule<Props, GroupProps, ListProps, TextFieldProps, NumberFieldProps, SelectFieldProps, number, "list">;
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