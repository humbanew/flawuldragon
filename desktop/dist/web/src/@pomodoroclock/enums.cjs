"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPCPomodoroType = exports.EPCPomodoroStatus = void 0;
var EPCPomodoroStatus;
(function (EPCPomodoroStatus) {
    EPCPomodoroStatus["None"] = "none";
    EPCPomodoroStatus["Running"] = "running";
    EPCPomodoroStatus["Paused"] = "paused";
    EPCPomodoroStatus["Done"] = "done";
})(EPCPomodoroStatus || (exports.EPCPomodoroStatus = EPCPomodoroStatus = {}));
var EPCPomodoroType;
(function (EPCPomodoroType) {
    EPCPomodoroType["Work"] = "work";
    EPCPomodoroType["LongBreak"] = "long break";
    EPCPomodoroType["Break"] = "break";
})(EPCPomodoroType || (exports.EPCPomodoroType = EPCPomodoroType = {}));
