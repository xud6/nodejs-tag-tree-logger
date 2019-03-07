import { logDriverBase } from "./logDriverBase";

export class logDriverBlank extends logDriverBase {
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