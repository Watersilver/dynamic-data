import Data from "./Data"

if (!new class { x: any }().hasOwnProperty('x')) console.warn("Uninitialized class field disappeared. Transpiler is not configured correctly.");

export default Data