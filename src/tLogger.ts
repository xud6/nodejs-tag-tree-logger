import { tLogLevel, tLogTag } from "./types";

export type logGenerator = () => any

/**
 * logger API 定义
 * 
 * @export
 * @interface loggerAPI
 */
export abstract class tLogger {
    constructor(readonly tags: string[]) {
    }
    abstract readonly debug: (msg: logGenerator | any) => void
    abstract readonly log: (msg: logGenerator | any) => void
    abstract readonly note: (msg: logGenerator | any) => void
    abstract readonly info: (msg: logGenerator | any) => void
    abstract readonly warn: (msg: logGenerator | any) => void
    abstract readonly error: (msg: logGenerator | any) => void
    abstract readonly fault: (msg: logGenerator | any) => void
    abstract readonly logger: (tags: tLogTag[]) => tLogger
}
