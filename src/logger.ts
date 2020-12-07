import { logDriverBase } from "./logDriverBase";
import { tLogTag, tLogLevel } from "./types";
import { forEach, union } from "lodash";
import { tLogger, logGenerator, tLogMsg } from "./tLogger";
import { formatMsg } from "./formatMsg";

export interface tHooks {
    beforeFaultExitProcess?: () => Promise<void> | void
}

class driverHolder {
    drivers: logDriverBase[]
    constructor() {
        this.drivers = []
    }
    add(d: logDriverBase) {
        this.drivers.push(d)
    }
    get() {
        return this.drivers;
    }
}

/**
 * standard logger implitation
 * 
 * @export
 * @implements {loggerAPI}
 */
export class logger extends tLogger {
    driverHolder: driverHolder
    /**
     * Creates an instance of logger.
     * @param drivers 
     * @param tags 
     * @param enabledTags 
     * @param faultTimout 
     * @param hooks
     */
    constructor(readonly paramDrivers: logDriverBase[], readonly tags: tLogTag[], enabledTags: string[] = [], readonly faultTimout: number = 10000, readonly hooks?: tHooks, readonly existDriverHolder?: driverHolder) {
        super(tags)
        if (existDriverHolder) {
            this.driverHolder = existDriverHolder
        } else {
            this.driverHolder = new driverHolder();
        }
        for (let d of paramDrivers) {
            this.driverHolder.add(d);
        }

        forEach(this.driverHolder.get(), (driver) => {
            driver.logEnable(enabledTags);
        })
    }
    private logOutputAll(level: tLogLevel, tags: tLogTag[], msg: logGenerator | tLogMsg, data: unknown) {
        if (typeof msg === "function") {
            msg = msg()
        }
        forEach(this.driverHolder.get(), (driver) => {
            driver.output(level, tags, formatMsg(msg), new Date(), data)
        })
    }
    /**
     * 
     * @param {logGenerator | tLogMsg} msg
     */
    readonly debug = (msg: logGenerator | tLogMsg, data?: unknown) => {
        this.logOutputAll(tLogLevel.debug, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | tLogMsg} msg
     */
    readonly log = (msg: logGenerator | tLogMsg, data?: unknown) => {
        this.logOutputAll(tLogLevel.log, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | tLogMsg} msg
     */
    readonly info = (msg: logGenerator | tLogMsg, data?: unknown) => {
        this.logOutputAll(tLogLevel.note, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | tLogMsg} msg
     */
    readonly note = (msg: logGenerator | tLogMsg, data?: unknown) => {
        this.logOutputAll(tLogLevel.note, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | tLogMsg} msg
     */
    readonly warn = (msg: logGenerator | tLogMsg, data?: unknown) => {
        this.logOutputAll(tLogLevel.warn, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | tLogMsg} msg
     */
    readonly error = (msg: logGenerator | tLogMsg, data?: unknown) => {
        this.logOutputAll(tLogLevel.error, this.tags, msg, data)
    }
    /**
     * 
     * @param {logGenerator | tLogMsg} msg
     */
    readonly fault = async (msg: logGenerator | tLogMsg, data?: unknown) => {
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
        let handlers = this.driverHolder.get().map((driver) => {
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
        return new logger([], union(this.tags, tags), enabledTags, this.faultTimout, this.hooks, this.driverHolder);
    }

    async logEnable(tags: string[]) {
        for (let driver of this.driverHolder.get()) {
            await driver.logEnable(tags);
        }
    }
    async logDisable(tags: string[]) {
        for (let driver of this.driverHolder.get()) {
            await driver.logDisable(tags);
        }
    }
    addLogDriver(d: logDriverBase) {
        this.driverHolder.add(d)
    }
}

export let cLogger = logger