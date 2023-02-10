import { EntityInterface, GroupInterface, ListInterface } from "../interface"
import { EntitySchema } from "../schema"
import Group from "./Group"
import List from "./List"
import NumberField from "./NumberField"
import TextField from "./TextField"
import SelectField from "./SelectField"

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

type JsonSchema = {
  type: "function", data: string
} | {
  type: "set" | "array", data: JsonSchema[]
} | {
  type: "map", data: [JsonSchema, JsonSchema][]
} | {
  type: "object", data: {[key: string]: JsonSchema}
} | {
  type: "primitive", data: unknown
}

// TODO: security for Function creator
class Data {
  entity: EntityInterface;
  onEntityConstruct;
  onFieldChange;
  constructor(schema: EntitySchema, options?: {
    onEntityConstruct?: (e: EntityInterface) => void;
    onFieldChange?: (e: EntityInterface) => void;
    props?: any;
  }) {
    this.props = options?.props;
    this.onEntityConstruct = options?.onEntityConstruct;
    this.entity = createEntity({data: this, schema});
    this.onFieldChange = options?.onFieldChange;
  }

  static import(jsonSchema: JsonSchema) {
    if (jsonSchema.type === "primitive") {
      return jsonSchema.data;
    } else if (jsonSchema.type === "function") {
      return new Function('"use strict"; const func = ' + jsonSchema.data + "; return func;")();
    } else if (jsonSchema.type === "set") {
      const data: any[] = [];
      for (const d of jsonSchema.data) {
        data.push(Data.import(d));
      }
      return new Set(data);
    } else if (jsonSchema.type === "array") {
      const data: any[] = [];
      for (const d of jsonSchema.data) {
        data.push(Data.import(d));
      }
      return data;
    } else if (jsonSchema.type === "map") {
      const data: any[] = [];
      for (const d of jsonSchema.data) {
        data.push(Data.import(d[0]), Data.import(d[1]));
      }
      return new Map(data);
    } else {
      const data: any = {};
      for (const [key, d] of Object.entries(jsonSchema.data)) {
        data[key] = this.import(d);
      }
      return data;
    }
  }

  // Does not handle cyclic structures at this point
  private _export(s: any): JsonSchema {
    if (typeof s === "function") {
      return {
        type: "function",
        data: s.toString()
      }
    } else if (typeof s === "object") {
      let o = s;
      let type: "map" | "array" | "set" | "object" = "object";
      let notArray = false;
      let e: any;
      if (s instanceof Map || s instanceof Set) {
        notArray = true;
        o = Array.from(o);
        type = s instanceof Map ? "map" : "set";
      }
      if (Array.isArray(o)) {
        type = notArray ? type : "array";
        e = [];
        for (const x of o) {
          e.push(this._export(x));
        }
      } else {
        e = {};
        for (const [key, value] of Object.entries(o)) {
          e[key] = this._export(value);
        }
      }
      return {
        type,
        data: e
      }
    } else {
      return {
        type: "primitive",
        data: s
      }
    }
  }
  // Exports json representation of schema
  export(): JsonSchema {
    return this._export(this.entity.schema);
  }

  props?: any;

  tread(): EntityInterface | undefined;
  tread(path: string): EntityInterface | undefined;
  tread(path: (string | number)[]): EntityInterface | undefined;
  tread(path?: (string | number)[] | string) {
    if (!path) path = [];
    if (typeof path === "string") {
      path = path.split(".").map(p => /^\d+$/.test(p) ? Number(p) : p);
    }

    let e: EntityInterface | undefined = this.entity;
    for (const p of path) {
      if (typeof p === "string") e = e?.group?.contents[p];
      else e = e?.list?.items[p];
      if (!e) return undefined;
    }
    return e;
  }
}

export default Data