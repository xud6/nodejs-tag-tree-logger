import { cLogDriverBlank } from "./logDriverBlank";
import { logger } from "./logger";

let blankLogDrive = new cLogDriverBlank()
export const blankLogger = new logger([blankLogDrive],[])