import { logDriverBase } from "./logDriverBase";
import { tLogTag, tLogLevel } from "./types";
import { forEach, union } from "lodash";
import { tLogger, logGenerator } from "./tLogger";

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
     */
    constructor(readonly drivers: logDriverBase[], readonly tags: tLogTag[], enabledTags: string[] = [], readonly faultTimout: number = 10000) {
        super()
        forEach(drivers, (driver) => {
            driver.logEnable(enabledTags);
        })
    }
    private logOutputAll(level: tLogLevel, tags: tLogTag[], msg: logGenerator | any) {
        if (typeof msg === "function") {
            msg = msg()
        }
        forEach(this.drivers, (driver) => {
            driver.output(level, tags, msg, new Date())
        })
    }
    /**
     * 
     * @param {logGenerator | any} msg
     */
    readonly debug = (msg: logGenerator | any) => {
        this.logOutputAll(tLogLevel.debug, this.tags, msg)
    }
    /**
     * 
     * @param {logGenerator | any} msg
     */
    readonly log = (msg: logGenerator | any) => {
        this.logOutputAll(tLogLevel.log, this.tags, msg)
    }
    /**
     * 
     * @param {logGenerator | any} msg
     */
    readonly info = (msg: logGenerator | any) => {
        this.logOutputAll(tLogLevel.note, this.tags, msg)
    }
    /**
     * 
     * @param {logGenerator | any} msg
     */
    readonly note = (msg: logGenerator | any) => {
        this.logOutputAll(tLogLevel.note, this.tags, msg)
    }
    /**
     * 
     * @param {logGenerator | any} msg
     */
    readonly warn = (msg: logGenerator | any) => {
        this.logOutputAll(tLogLevel.warn, this.tags, msg)
    }
    /**
     * 
     * @param {logGenerator | any} msg
     */
    readonly error = (msg: logGenerator | any) => {
        this.logOutputAll(tLogLevel.error, this.tags, msg)
    }
    /**
     * 
     * @param {logGenerator | any} msg
     */
    readonly fault = (msg: logGenerator | any) => {
        this.logOutputAll(tLogLevel.fault, this.tags, msg)
        setTimeout(() => {
            process.exit(-1);
        }, this.faultTimout)
        return this.completeTransferAndExit();
    }
    private async completeTransferAndExit() {
        let handlers = this.drivers.map((driver)=>{
            return driver.completeTransfer();
        })
        for(let handler of handlers){
            try{
                await handler
            }catch(e){
                console.error(e)
            }
        }
        process.exit(-1);
    }
    /**
     * Create a sub logger instance include all tags of parent and use same log driver
     * @param {string[]} tags
     * @param {string[]} enabledTags
     */
    readonly logger = (tags: tLogTag[], enabledTags: tLogTag[] = []) => {
        return new logger(this.drivers, union(this.tags, tags), enabledTags);
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