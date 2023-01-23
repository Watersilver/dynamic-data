import { Json } from "./Data/helpers/Json"
import { EntityInterface, GroupInterface, ListInterface, NumberFieldInterface, SelectFieldInterface, TextFieldInterface } from "./interface"

type Rule<
  T = any,
  Type = string,
  Subtype = string
> = T | ((
  entity: Type extends "field" ? (
    Subtype extends "text" ? TextFieldInterface
    : Subtype extends "number" ? NumberFieldInterface
    : Subtype extends "select" ? SelectFieldInterface
    : EntityInterface
  ) : Type extends "group" ? GroupInterface
  : Type extends "list" ? ListInterface
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

type AbstractEntitySchema = {
  type: string;
  props?: {[key: string]: any};
};

type AbstractFieldSchema = AbstractEntitySchema & {
  type: "field";
  subtype: string;
};

export type TextFieldSchema = AbstractFieldSchema & {
  subtype: "text";
  default?: Rule<string, "field", "text">;
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

export type NumberFieldSchema = AbstractFieldSchema & {
  subtype: "number";
  default?: Rule<number, "field", "number">;
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

export type SelectFieldSchema = AbstractFieldSchema & {
  subtype: "select";
  options: Json[];
  default?: Rule<Json[], "field", "select">;
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

export type FieldSchema = TextFieldSchema | NumberFieldSchema | SelectFieldSchema;

/** Represents a group of speific distinct things */
export type GroupSchema = AbstractEntitySchema & {
  type: "group";
  default?: Rule<{[key: string]: any}, "group">;
  contents: {
    [name: string]: EntitySchema;
  };
  rules?: BaseRules<"group">;
};

/** Represents an arbitrary number of similar things */
export type ListSchema = AbstractEntitySchema & {
  type: "list";
  default?: Rule<any[], "list">;
  items: EntitySchema;
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

export type EntitySchema = FieldSchema | GroupSchema | ListSchema;