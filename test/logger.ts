import { expect } from 'chai';
import 'mocha';
import { logDriverBase } from '../src/logDriverBase';
import { tLogLevel } from '../src/types';
import { logger } from '../src';

class cLogDriverTest extends logDriverBase {
    currentLog: {
        msg?: any,
        level?: tLogLevel,
        tags?: string[],
        timestamp?: Date,
        data?: any
    }
    constructor(readonly colorEnable: boolean = true) {
        super()
        this.currentLog = {}
    }
    output(level: tLogLevel, tags: string[], msg: any, timestamp: Date, data: any) {
        this.currentLog.level = level;
        this.currentLog.tags = tags;
        this.currentLog.msg = msg;
        this.currentLog.timestamp = timestamp;
        this.currentLog.data = data
    }
    completeTransfer() { }
    logEnable() {
    }
    logDisable() {
    }
}

let logDriverTest = new cLogDriverTest();
let slogger = new logger([logDriverTest], ["TEST"], [])

describe('logger test', () => {
    it('should log string', () => {
        slogger.log("should log string")
        expect(logDriverTest.currentLog.msg).to.equal("should log string");
        expect(logDriverTest.currentLog.level).to.equal(tLogLevel.log);
        expect(logDriverTest.currentLog.tags).to.deep.equal(["TEST"]);
    })
    it('should execute function and log string', () => {
        slogger.error(() => { return "should log function" })
        expect(logDriverTest.currentLog.msg).to.deep.equal("should log function");
        expect(logDriverTest.currentLog.level).to.equal(tLogLevel.error);
        expect(logDriverTest.currentLog.tags).to.deep.equal(["TEST"]);
    })
    it('should log optional data', () => {
        slogger.log("should log optional data", { data: "testData", test: true })
        expect(logDriverTest.currentLog.msg).to.equal("should log optional data");
        expect(logDriverTest.currentLog.level).to.equal(tLogLevel.log);
        expect(logDriverTest.currentLog.tags).to.deep.equal(["TEST"]);
        expect(logDriverTest.currentLog.data).to.deep.equal({ data: "testData", test: true });
    })
})