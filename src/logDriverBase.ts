import { tLogLevel } from "./types";

export abstract class logDriverBase {
    abstract output(level: tLogLevel, tags: string[], msg: string, timestamp: Date, data?: unknown): void
    abstract logEnable(tags: string[]): Promise<void> | void
    abstract logDisable(tags: string[]): Promise<void> | void
    abstract completeTransfer(): Promise<void> | void
}

export let cLogDriverBase = logDriverBase