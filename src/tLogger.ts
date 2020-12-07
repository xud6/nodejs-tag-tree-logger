import { tLogLevel, tLogTag } from "./types";

export type tLogMsg = string | unknown
export type logGenerator = () => tLogMsg

/**
 * logger API 定义
 * 
 * @export
 * @interface loggerAPI
 */
export abstract class tLogger {
    // for backward compatibility only
    level: tLogLevel
    constructor(readonly tags: string[]) {
        this.level = tLogLevel.note
    }
    abstract readonly debug: (msg: logGenerator | tLogMsg, data?: unknown) => void
    abstract readonly log: (msg: logGenerator | tLogMsg, data?: unknown) => void
    abstract readonly note: (msg: logGenerator | tLogMsg, data?: unknown) => void
    abstract readonly info: (msg: logGenerator | tLogMsg, data?: unknown) => void
    abstract readonly warn: (msg: logGenerator | tLogMsg, data?: unknown) => void
    abstract readonly error: (msg: logGenerator | tLogMsg, data?: unknown) => void
    abstract readonly fault: (msg: logGenerator | tLogMsg, data?: unknown) => void
    abstract readonly logger: (tags: tLogTag[]) => tLogger
}
