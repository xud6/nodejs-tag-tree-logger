import { logDriverBase } from "./logDriverBase";

export class cLogDriverBlank extends logDriverBase {
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