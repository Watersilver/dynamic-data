import Data from "./Data"
import { isGroup, isList, isNumberField, isSelectField, isTextField } from "./interface";

if (!new class { x: any }().hasOwnProperty('x')) console.warn("Uninitialized class field disappeared. Transpiler is not configured correctly.");

export default Data

export type Group<D extends Data> = NonNullable<D['entity']['group']>;
export type List<D extends Data> = NonNullable<D['entity']['list']>;
export type NumberField<D extends Data> = NonNullable<D['entity']['number']>;
export type TextField<D extends Data> = NonNullable<D['entity']['text']>;
export type SelectField<D extends Data> = NonNullable<D['entity']['select']>;

export {
  isGroup,
  isList,
  isSelectField,
  isNumberField,
  isTextField
}