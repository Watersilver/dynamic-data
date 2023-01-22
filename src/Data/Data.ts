import { EntityInterface, GroupInterface, ListInterface } from "../interface"
import { EntitySchema } from "../schema"
import Group from "./Group";
import List from "./List";
import NumberField from "./NumberField";
import TextField from "./TextField";
import SelectField from "./SelectField";

// Bypasses circular dependecies
function createEntity({
  schema,
  data,
  container,
}: {
  data: Data,
  schema: EntitySchema,
  container?: ListInterface | GroupInterface,
  createEntity?: typeof createEntity
}) {
  switch (schema.type) {
    case "list":
      return new List({schema, data, container, createEntity});
    case "group":
      return new Group({schema, data, container, createEntity});
    case "field":
      switch (schema.subtype) {
        case "number":
          return new NumberField({schema, data, container});
        case "text":
          return new TextField({schema, data, container});
        case "select":
          return new SelectField({schema, data, container});
        default:
          throw TypeError("Subtype " + (schema as any).subtype + " has not been taken into account.");
      }
    default:
      throw TypeError("Type " + (schema as any).type + " has not been taken into account.");
  }
}

export type EntityCreator = typeof createEntity;

// TODO: import and export
// TODO: Add generic props parameters
// TODO: Export guards and types
// TODO: Async rules and func/async default value
class Data<
  Props = any,
  GroupProps = Props,
  ListProps = GroupProps,
  TextFieldProps = ListProps,
  NumberFieldProps = TextFieldProps,
  SelectFieldProps = NumberFieldProps
> {
  entity: EntityInterface<
    Props,
    GroupProps,
    ListProps,
    TextFieldProps,
    NumberFieldProps,
    SelectFieldProps
  >;
  onEntityConstruct;
  onFieldChange;
  constructor(schema: EntitySchema<
      Props,
      GroupProps,
      ListProps,
      TextFieldProps,
      NumberFieldProps,
      SelectFieldProps
    >, options?: {
    onEntityConstruct?: (e: EntityInterface<
      Props,
      GroupProps,
      ListProps,
      TextFieldProps,
      NumberFieldProps,
      SelectFieldProps
    >) => void;
    onFieldChange?: (e: EntityInterface<
      Props,
      GroupProps,
      ListProps,
      TextFieldProps,
      NumberFieldProps,
      SelectFieldProps
    >) => void;
    props?: Props;
  }) {
    this.props = options?.props;
    this.onEntityConstruct = options?.onEntityConstruct;
    this.entity = createEntity({data: this, schema});
    this.onFieldChange = options?.onFieldChange;
  }

  props?: Props;

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
  tread(path?: (string | number)[] | string) {
    if (!path) path = [];
    if (typeof path === "string") {
      path = path.split(".").map(p => /^\d+$/.test(p) ? Number(p) : p);
    }

    let e: EntityInterface<
      Props,
      GroupProps,
      ListProps,
      TextFieldProps,
      NumberFieldProps,
      SelectFieldProps
    > | undefined = this.entity;
    for (const p of path) {
      if (typeof p === "string") e = e?.group?.contents[p];
      else e = e?.list?.items[p];
      if (!e) return undefined;
    }
    return e;
  }
}

export default Data