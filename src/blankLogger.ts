import { logDriverBlank } from "./logDriverBlank";
import { logger } from "./logger";

let blankLogDrive = new logDriverBlank()
export const blankLogger = new logger([blankLogDrive],[])