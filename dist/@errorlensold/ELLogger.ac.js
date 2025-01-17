"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELLogger = void 0;
// utils/logger.ts
/**
 * log. console.log (when developing).
 */
class ELLogger {
    isEnabled;
    constructor({ isDev }) {
        this.isEnabled = isDev;
    }
    log(message, ...args) {
        this.innerLog('log', message, ...args);
    }
    warn(message, ...args) {
        this.innerLog('warn', message, ...args);
    }
    innerLog(severity, message, ...args) {
        if (!this.isEnabled) {
            return;
        }
        if (args.length) {
            console[severity](message, args);
        }
        else {
            console[severity](message);
        }
    }
}
exports.ELLogger = ELLogger;
