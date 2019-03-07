import { tLogLevel } from "./types";

export abstract class logDriverBase {
    abstract output(level: tLogLevel, tags: string[], msg: any, timestamp: Date): void
    abstract logEnable(tags: string[]): Promise<void> | void
    abstract logDisable(tags: string[]): Promise<void> | void
    abstract completeTransfer(): Promise<void> | void
}

export let cLogDriverBase = logDriverBase