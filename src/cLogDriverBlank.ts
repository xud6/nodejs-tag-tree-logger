import { cLogDriverBase } from "./cLogDriverBase";

export class cLogDriverBlank extends cLogDriverBase {
    constructor(readonly colorEnable: boolean = true) {
        super()
    }
    output() {
    }
    completeTransfer() { }
    logEnable() {
    }
    logDisable() {
    }
}