import { tLogLevel, tLogTag } from "./types";

export type logGenerator = () => unknown

/**
 * logger API 定义
 * 
 * @export
 * @interface loggerAPI
 */
export abstract class tLogger {
    constructor(readonly tags: string[]) {
    }
    abstract readonly debug: (msg: logGenerator | unknown, data?: unknown) => void
    abstract readonly log: (msg: logGenerator | unknown, data?: unknown) => void
    abstract readonly note: (msg: logGenerator | unknown, data?: unknown) => void
    abstract readonly info: (msg: logGenerator | unknown, data?: unknown) => void
    abstract readonly warn: (msg: logGenerator | unknown, data?: unknown) => void
    abstract readonly error: (msg: logGenerator | unknown, data?: unknown) => void
    abstract readonly fault: (msg: logGenerator | unknown, data?: unknown) => void
    abstract readonly logger: (tags: tLogTag[]) => tLogger
}
