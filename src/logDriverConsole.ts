import { logDriverBase } from "./logDriverBase";
import chalk, { Chalk } from "chalk";
import { tLogLevel } from "./types";
import { difference, union, intersection, reduce, find } from "lodash";
import { format } from "util";

export class logDriverConsole extends logDriverBase {
    chalk: Chalk
    private readonly avaliableTagColors: Chalk[]
    private avaliableTagColorCnt = 0
    constructor(readonly colorEnable: boolean = true) {
        super()
        let chalkoptions: chalk.Options = {}
        if (colorEnable == false) {
            chalkoptions.level = 0;
        }
        this.chalk = new chalk.Instance(chalkoptions)
        this.avaliableTagColors = [this.chalk.green, this.chalk.yellow, this.chalk.blue, this.chalk.cyan, this.chalk.red, this.chalk.magenta, this.chalk.gray]
    }
    output(level: tLogLevel, tags: string[], msg: any, timestamp: Date) {
        if (level >= tLogLevel.log) {
            if (!this.logFilter(tags)) {
                // log disabled
                return;
            }
        }
        console.log(timestamp.toISOString() + ' ' + this.genStringLogLevel(level) + "[" + this.genStringTags(tags) + "] " + format(msg))
    }
    completeTransfer() { }
    private logEnabledTags: string[] = []
    private logFilter(tags: string[]): boolean {
        return (intersection(tags, this.logEnabledTags).length !== 0)
    }
    logEnable(tags: string[]) {
        this.logEnabledTags = union(this.logEnabledTags, tags);
    }
    logDisable(tags: string[]) {
        this.logEnabledTags = difference(this.logEnabledTags, tags);
    }
    private genStringLogLevel(level: tLogLevel): string {
        switch (level) {
            case tLogLevel.debug:
                return this.chalk.bgBlack.gray("DEBUG")
            case tLogLevel.log:
                return this.chalk.bgWhite.black("LOG  ")
            case tLogLevel.note:
                return this.chalk.bgWhite.black("NOTE ")
            case tLogLevel.warn:
                return this.chalk.bgYellow.black("WARN ")
            case tLogLevel.error:
                return this.chalk.bgRed.black("ERROR")
            case tLogLevel.fault:
                return this.chalk.bold.bgRed.black("FAULT")
            default:
                return "NOLEVEL"
        }
    }
    private genStringTags(tags: string[]) {
        return reduce(tags, (sum: string, tag: string, cnt: number) => {
            if (cnt === 0) {
                return sum + this.getTagColor(tag)(tag);
            } else {
                return sum + ',' + this.getTagColor(tag)(tag);
            }
        }, "")
    }
    private tagColorTable: { tag: string, color: Chalk }[] = []
    private getTagColor(tag: string): Chalk {
        let cache = find(this.tagColorTable, (tagColor) => {
            return tag === tagColor.tag
        })
        if (cache) {
            return cache.color
        } else {
            this.avaliableTagColorCnt += 1;
            if (this.avaliableTagColorCnt >= this.avaliableTagColors.length) {
                this.avaliableTagColorCnt = 0;
            }
            let color = this.avaliableTagColors[this.avaliableTagColorCnt];
            this.tagColorTable.push({
                tag: tag,
                color: color
            })
            return color
        }
    }
}

export let cLogDriverConsole = logDriverConsole