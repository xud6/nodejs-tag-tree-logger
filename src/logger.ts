import { logDriverBase } from "./logDriverBase";
import { tLogTag, tLogLevel } from "./types";
import { forEach, union } from "lodash";
import { tLogger, logGenerator } from "./tLogger";
import { formatMsg } from "./formatMsg";

export interface tHooks {
    beforeFaultExitProcess?: () => Promise<void> | void
}

/**
 * standard logger implitation
 * 
 * @export
 * @implements {loggerAPI}
 */
export class logger extends tLogger {
    /**
     * Creates an instance of logger.
     * @param drivers 
     * @param tags 
     * @param enabledTags 
     * @param faultTimout 
     * @param hooks
     */
    constructor(readonly drivers: logDriverBase[], readonly tags: tLogTag[], enabledTags: string[] = [], readonly faultTimout: number = 10000, readonly hooks?: tHooks) {
        super(tags)
        forEach(drivers, (driver) => {
            driver.logEnable(enabledTags);
        })
    }
    private logOutputAll(level: tLogLevel, tags: tLogTag[], msg: logGenerator | unknown, data: unknown) {
        if (typeof msg === "function") {
            msg = msg()
        }
        forEach(this.drivers, (driver) => {
            driver.output(level, tags, formatMsg(msg), new Date(), data)
        })
    }
    /**
     * 
     * @param {logGenerator | unknown} msg
     */
    readonly debug = (msg: logGenerator | unknown, data?: unknown) => {
        this.logOutputAll(tLogLevel.debug, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | unknown} msg
     */
    readonly log = (msg: logGenerator | unknown, data?: unknown) => {
        this.logOutputAll(tLogLevel.log, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | unknown} msg
     */
    readonly info = (msg: logGenerator | unknown, data?: unknown) => {
        this.logOutputAll(tLogLevel.note, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | unknown} msg
     */
    readonly note = (msg: logGenerator | unknown, data?: unknown) => {
        this.logOutputAll(tLogLevel.note, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | unknown} msg
     */
    readonly warn = (msg: logGenerator | unknown, data?: unknown) => {
        this.logOutputAll(tLogLevel.warn, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | unknown} msg
     */
    readonly error = (msg: logGenerator | unknown, data?: unknown) => {
        this.logOutputAll(tLogLevel.error, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | unknown} msg
     */
    readonly fault = async (msg: logGenerator | unknown, data?: unknown) => {
        this.logOutputAll(tLogLevel.fault, this.tags, msg, data)
        this.logOutputAll(tLogLevel.fault, [], "Process will exit because of a fault", data)
        setTimeout(() => {
            process.exit(-1);
        }, this.faultTimout)
        await this.completeLogTransfer();
        if (this.hooks && this.hooks.beforeFaultExitProcess) {
            await this.hooks.beforeFaultExitProcess();
            await this.completeLogTransfer();
        }
        process.exit(-1);
    }
    private async completeLogTransfer() {
        let handlers = this.drivers.map((driver) => {
            return driver.completeTransfer();
        })
        for (let handler of handlers) {
            try {
                await handler
            } catch (e) {
                console.error(e)
            }
        }
    }
    /**
     * Create a sub logger instance include all tags of parent and use same log driver
     * @param {string[]} tags
     * @param {string[]} enabledTags
     */
    readonly logger = (tags: tLogTag[], enabledTags: tLogTag[] = []) => {
        return new logger(this.drivers, union(this.tags, tags), enabledTags, this.faultTimout, this.hooks);
    }

    async logEnable(tags: string[]) {
        for (let driver of this.drivers) {
            await driver.logEnable(tags);
        }
    }
    async logDisable(tags: string[]) {
        for (let driver of this.drivers) {
            await driver.logDisable(tags);
        }
    }
}

export let cLogger = logger