import { logger } from "./cLoggerBase";
import { tLogLevel } from "./types";

export class cBlankLogger extends logger {
    tags: string[] = ['BlankLogger']
    level: tLogLevel = tLogLevel.fault
    constructor() {
        super()
    }
    readonly debug = async (msg: any) => { }
    readonly log = async (msg: any) => { }
    readonly note = async (msg: any) => { }
    readonly info = async (msg: any) => { }
    readonly warn = async (msg: any) => { }
    readonly error = async (msg: any) => { }
    readonly fault = async (msg: any) => {
        console.log("FAUL: [BlankLogger]" + msg.message || msg);
        process.exit(-1);
    }
    readonly logger = (tags: string[]) => {
        return this;
    }
    logEnable(tags: string[]) { }
    logDisable(tags: string[]) { }
}