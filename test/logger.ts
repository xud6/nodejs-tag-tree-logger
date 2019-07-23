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
        timestamp?: Date
    }
    constructor(readonly colorEnable: boolean = true) {
        super()
        this.currentLog = {}
    }
    output(level: tLogLevel, tags: string[], msg: any, timestamp: Date) {
        this.currentLog.level = level;
        this.currentLog.tags = tags;
        this.currentLog.msg = msg;
        this.currentLog.timestamp = timestamp;
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
    it('should log number', () => {
        slogger.debug(12345)
        expect(logDriverTest.currentLog.msg).to.equal(12345);
        expect(logDriverTest.currentLog.level).to.equal(tLogLevel.debug);
        expect(logDriverTest.currentLog.tags).to.deep.equal(["TEST"]);
    })
    it('should log object', () => {
        slogger.note({packet:"log",no:321})
        expect(logDriverTest.currentLog.msg).to.deep.equal({packet:"log",no:321});
        expect(logDriverTest.currentLog.level).to.equal(tLogLevel.note);
        expect(logDriverTest.currentLog.tags).to.deep.equal(["TEST"]);
    })
    it('should log array', () => {
        slogger.warn(["32",123,{p:1,t:"11"}])
        expect(logDriverTest.currentLog.msg).to.deep.equal(["32",123,{p:1,t:"11"}]);
        expect(logDriverTest.currentLog.level).to.equal(tLogLevel.warn);
        expect(logDriverTest.currentLog.tags).to.deep.equal(["TEST"]);
    })
    it('should execute function and log object', () => {
        slogger.error(()=>{return {packet:"log33",no:32221}})
        expect(logDriverTest.currentLog.msg).to.deep.equal({packet:"log33",no:32221});
        expect(logDriverTest.currentLog.level).to.equal(tLogLevel.error);
        expect(logDriverTest.currentLog.tags).to.deep.equal(["TEST"]);
    })
})