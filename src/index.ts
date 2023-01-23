import Data from "./Data"
import {
  isGroup, isList, isNumberField, isSelectField, isTextField,
  GroupInterface, ListInterface, SelectFieldInterface, TextFieldInterface, NumberFieldInterface,
  GroupErrors, ListErrors, SelectFieldErrors, TextFieldErrors, NumberFieldErrors
} from "./interface";
import {
  GroupSchema, ListSchema, SelectFieldSchema, TextFieldSchema, NumberFieldSchema
} from "./schema"

if (!new class { x: any }().hasOwnProperty('x')) console.warn("Uninitialized class field disappeared. Transpiler is not configured correctly.");

export default Data

export type {
  GroupInterface, ListInterface, SelectFieldInterface, TextFieldInterface, NumberFieldInterface,
  GroupErrors, ListErrors, SelectFieldErrors, TextFieldErrors, NumberFieldErrors,
  GroupSchema, ListSchema, SelectFieldSchema, TextFieldSchema, NumberFieldSchema
}

export {
  isGroup,
  isList,
  isSelectField,
  isNumberField,
  isTextField
}