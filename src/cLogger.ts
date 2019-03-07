import { logger } from "./cLoggerBase";
import { cLogDriverBase } from "./cLogDriverBase";
import { tLogTag, tLogLevel } from "./types";
import { forEach, union } from "lodash";

async function asyncForEach<T>(array: T[], callback: (obj: T, index: number, array: T[]) => Promise<void>) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}
/**
 * logger
 * 
 * @export
 * @implements {loggerAPI}
 */
export class cLogger extends logger {
    /**
     * Creates an instance of logger.
     * @param {string[]} tags 标签
     * @param {tLogLevel} [level=logLevelTable.warn] 最大输出log level
     */

    constructor(readonly drivers: cLogDriverBase[], readonly tags: tLogTag[], enabledTags: string[] = [], readonly faultTimout: number = 1000) {
        super()
        forEach(drivers, (driver) => {
            driver.logEnable(enabledTags);
        })
    }
    private logOutputAll(level: tLogLevel, tags: tLogTag[], msg: any) {
        forEach(this.drivers, (driver) => {
            driver.output(level, tags, msg, new Date())
        })
    }
    /**
     * 
     * @param {any} msg
     */
    readonly debug = (msg: any) => {
        this.logOutputAll(tLogLevel.debug, this.tags, msg)
    }
    /**
     * 
     * @param {any} msg
     */
    readonly log = (msg: any) => {
        this.logOutputAll(tLogLevel.log, this.tags, msg)
    }
    /**
     * 
     * @param {any} msg
     */
    readonly info = (msg: any) => {
        this.logOutputAll(tLogLevel.note, this.tags, msg)
    }
    /**
     * 
     * @param {any} msg
     */
    readonly note = (msg: any) => {
        this.logOutputAll(tLogLevel.note, this.tags, msg)
    }
    /**
     * 
     * @param {any} msg
     */
    readonly warn = (msg: any) => {
        this.logOutputAll(tLogLevel.warn, this.tags, msg)
    }
    /**
     * 
     * @param {any} msg
     */
    readonly error = (msg: any) => {
        this.logOutputAll(tLogLevel.error, this.tags, msg)
    }
    /**
     * 
     * @param {any} msg
     */
    readonly fault = (msg: any) => {
        this.logOutputAll(tLogLevel.fault, this.tags, msg)
        setTimeout(() => {
            process.exit(-1);
        }, this.faultTimout)
        asyncForEach(this.drivers, async (driver) => {
            await driver.completeTransfer()
        }).then(() => {
            process.exit(-1);
        })
    }
    /**
     * 生成一个子logger，包含父logger的所有标签
     * @param {string[]} tags
     */
    readonly logger = (tags: tLogTag[], enabledTags: tLogTag[] = []) => {
        return new cLogger(this.drivers, union(this.tags, tags), enabledTags);
    }

    async logEnable(tags: string[]) {
        asyncForEach(this.drivers, async (driver) => {
            await driver.logEnable(tags);
        })
    }
    async logDisable(tags: string[]) {
        asyncForEach(this.drivers, async (driver) => {
            await driver.logDisable(tags);
        })
    }
}