"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTime = void 0;
const vscode = require("vscode");
const EDTFormatType_enum_cjs_1 = require("./EDTFormatType.enum.cjs");
const EDTFlashState_enum_cjs_1 = require("./EDTFlashState.enum.cjs");
const index_js_1 = require("./dayjs/esm/index.js");
const index_js_2 = require("./dayjs/esm/plugin/weekOfYear/index.js");
const index_js_3 = require("./dayjs/esm/plugin/weekday/index.js");
const index_js_4 = require("./dayjs/esm/plugin/weekYear/index.js");
const isoWeek_1 = require("./dayjs/esm/plugin/isoWeek");
const index_js_5 = require("./dayjs/esm/plugin/utc/index.js");
const timezone_1 = require("./dayjs/esm/plugin/timezone");
const dayOfYear_1 = require("./dayjs/esm/plugin/dayOfYear");
const index_js_6 = require("./dayjs/esm/plugin/advancedFormat/index.js");
class DateTime {
    cache = this.datetime_getDefaultCache();
    timeCharacters = "HhmSs";
    seconds = 1000;
    minutes = 60 * this.seconds;
    firstUpdateTimeout;
    updateInterval;
    reEscape = /(\[.+?\])/;
    reFormat = /Mo|Qo|DDDD|DDDo?|do|eo?|Eo?|Wo|gggg|gg|GGGG|GG|SSS|SS|S/g;
    datetimeStatusBarItem;
    isRunning = false;
    isStatusBarVisible = false;
    currentFlashState;
    type_dayjs;
    datetime_getDefaultCache() {
        return {
            format: {
                [EDTFlashState_enum_cjs_1.EDTFlashState.on]: null,
                [EDTFlashState_enum_cjs_1.EDTFlashState.off]: null,
            },
            configuration: {},
        };
    }
    datetime_preCache() {
        if (!this.cache.format[EDTFlashState_enum_cjs_1.EDTFlashState.on]) {
            this.datetime_getFormat(EDTFlashState_enum_cjs_1.EDTFlashState.on);
        }
        if (!this.cache.format[EDTFlashState_enum_cjs_1.EDTFlashState.off] &&
            this.datetime_shouldFlashTimeSeparators()) {
            this.datetime_getFormat(EDTFlashState_enum_cjs_1.EDTFlashState.off);
        }
    }
    datetime_clearCache() {
        this.cache = this.datetime_getDefaultCache();
    }
    datetime_getConfiguration(property) {
        if (!this.cache.configuration.hasOwnProperty(property)) {
            this.cache.configuration[property] =
                vscode.workspace.getConfiguration("dateTime")[property];
        }
        return this.cache.configuration[property];
    }
    datetime_shouldShowOnStartup() {
        return this.datetime_getConfiguration("showOnStartup");
    }
    datetime_getCustomFormat(flashState, property = "customFormat") {
        const format = this.datetime_getConfiguration(property);
        if (!format) {
            return null;
        }
        if (flashState === EDTFlashState_enum_cjs_1.EDTFlashState.on) {
            return format;
        }
        else {
            const reSeparator = this.datetime_getFormatTimeSeparatorRegExp();
            return format.replace(reSeparator, "$1" + this.datetime_getTimeSeparatorOff());
        }
    }
    datetime_hasCustomFormat() {
        return this.datetime_getCustomFormat(EDTFlashState_enum_cjs_1.EDTFlashState.on) !== null;
    }
    datetime_getLocale() {
        return this.datetime_getConfiguration("locale") || vscode.env.language;
    }
    datetime_getTimeZone() {
        return this.datetime_getConfiguration("timeZone") || null;
    }
    datetime_getFormatTimeSeparatorRegExp() {
        const separator = this.datetime_escapeRegExp(this.datetime_getTimeSeparator());
        return new RegExp(`([${this.timeCharacters}]+[^${this.timeCharacters}${separator}]*)${separator}`, "g");
    }
    datetime_shouldShowHours() {
        return this.datetime_getConfiguration("showHours");
    }
    datetime_shouldShowMinutes() {
        return this.datetime_getConfiguration("showMinutes");
    }
    datetime_shouldShowSeconds() {
        const customFormat = this.datetime_getCustomFormat(EDTFlashState_enum_cjs_1.EDTFlashState.on);
        if (customFormat && customFormat.indexOf("s") > -1) {
            return true;
        }
        return this.datetime_getConfiguration("showSeconds");
    }
    datetime_shouldShowFractionalSeconds() {
        return this.datetime_getFormat(EDTFlashState_enum_cjs_1.EDTFlashState.on).indexOf("S") > -1;
    }
    datetime_getFractionalPrecision() {
        let precision = this.datetime_getConfiguration("fractionalPrecision");
        if (typeof precision !== "number") {
            const format = this.datetime_getFormat(EDTFlashState_enum_cjs_1.EDTFlashState.on);
            let exponent = (format.match(/S/g) || []).length;
            if (exponent === 0) {
                exponent = format.indexOf("x") > -1 ? 3 : 0;
            }
            precision = Math.pow(10, exponent);
        }
        if (precision < 1) {
            precision = 1;
        }
        else if (precision > 100) {
            precision = 100;
        }
        return precision;
    }
    datetime_shouldShowDayOfWeek() {
        return this.datetime_getConfiguration("showDayOfWeek");
    }
    datetime_shouldShowDayOfMonth() {
        return this.datetime_getConfiguration("showDayOfMonth");
    }
    datetime_shouldShowMonth() {
        return this.datetime_getConfiguration("showMonth");
    }
    datetime_shouldUse24HourClock() {
        return this.datetime_getConfiguration("use24HourClock");
    }
    datetime_shouldShowAMPM() {
        return this.datetime_getConfiguration("showAMPM");
    }
    datetime_shouldPadHours() {
        return this.datetime_getConfiguration("padHours");
    }
    datetime_shouldPadMinutes() {
        return this.datetime_getConfiguration("padMinutes");
    }
    datetime_shouldPadSeconds() {
        return this.datetime_getConfiguration("padSeconds");
    }
    datetime_shouldPadDays() {
        return this.datetime_getConfiguration("padDays");
    }
    datetime_getTimeSeparator() {
        return this.datetime_getConfiguration("timeSeparator");
    }
    datetime_getTimeSeparatorOff() {
        return this.datetime_getConfiguration("timeSeparatorOff");
    }
    datetime_shouldFlashTimeSeparators() {
        return this.datetime_getConfiguration("flashTimeSeparators");
    }
    datetime_getFormat(flashState) {
        if (!this.cache.format[flashState]) {
            this.cache.format[flashState] =
                this.datetime_getCustomFormat(flashState) ||
                    this.datetime_composeFormat(flashState);
        }
        return this.cache.format[flashState];
    }
    datetime_hasFormat() {
        return this.datetime_getFormat(EDTFlashState_enum_cjs_1.EDTFlashState.on).length > 0;
    }
    datetime_composeFormat(flashState) {
        const separator = flashState === EDTFlashState_enum_cjs_1.EDTFlashState.on
            ? this.datetime_getTimeSeparator()
            : this.datetime_getTimeSeparatorOff();
        let format = "";
        if (this.datetime_shouldShowHours()) {
            if (this.datetime_shouldUse24HourClock()) {
                format += this.datetime_shouldPadHours() ? "HH" : "H";
            }
            else {
                format += this.datetime_shouldPadHours() ? "hh" : "h";
            }
        }
        if (this.datetime_shouldShowMinutes()) {
            format +=
                (this.datetime_shouldShowHours() ? separator : "") +
                    (this.datetime_shouldPadMinutes() ? "mm" : "m");
        }
        if (this.datetime_shouldShowSeconds()) {
            format +=
                (this.datetime_shouldShowHours() || this.datetime_shouldShowMinutes()
                    ? separator
                    : "") + (this.datetime_shouldPadSeconds() ? "ss" : "s");
        }
        if (this.datetime_shouldShowAMPM()) {
            format += " A";
        }
        if (this.datetime_shouldShowMonth()) {
            format = "MMM " + format;
        }
        if (this.datetime_shouldShowDayOfMonth()) {
            format = (this.datetime_shouldPadDays() ? "DD" : "D") + " " + format;
        }
        if (this.datetime_shouldShowDayOfWeek()) {
            format = "ddd " + format;
        }
        return format;
    }
    datetime_getStatusBarAlignment() {
        return this.datetime_getConfiguration("statusBarAlignment") === "left"
            ? vscode.StatusBarAlignment.Left
            : vscode.StatusBarAlignment.Right;
    }
    datetime_getStatusBarPriority() {
        const configuredPriority = this.datetime_getConfiguration("statusBarPriority");
        if (typeof configuredPriority === "number") {
            return configuredPriority;
        }
        switch (this.datetime_getStatusBarAlignment()) {
            case vscode.StatusBarAlignment.Left:
                return 97;
            case vscode.StatusBarAlignment.Right:
                return -97;
        }
    }
    datetime_getDisplayPrefix() {
        return this.datetime_getConfiguration("displayPrefix") || "";
    }
    datetime_getDisplaySuffix() {
        return this.datetime_getConfiguration("displaySuffix") || "";
    }
    datetime_escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    datetime_startSchedule(callback) {
        const format = this.datetime_getFormat(EDTFlashState_enum_cjs_1.EDTFlashState.on);
        if (this.datetime_shouldShowFractionalSeconds() ||
            format.indexOf("x") > -1) {
            this.datetime_scheduleMillisecondUpdates(callback);
        }
        else if (this.datetime_shouldShowSeconds() ||
            this.datetime_shouldFlashTimeSeparators() ||
            format.indexOf("X") > -1) {
            this.datetime_scheduleSecondUpdates(callback);
        }
        else {
            this.datetime_scheduleMinuteUpdates(callback);
        }
    }
    datetime_stopSchedule() {
        if (this.firstUpdateTimeout) {
            clearTimeout(this.firstUpdateTimeout);
            this.firstUpdateTimeout = null;
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    datetime_scheduleMillisecondUpdates(callback) {
        this.updateInterval = setInterval(callback, (1 / this.datetime_getFractionalPrecision()) * this.seconds);
    }
    datetime_scheduleSecondUpdates(callback) {
        this.updateInterval = setInterval(callback, 1 * this.seconds);
    }
    datetime_scheduleMinuteUpdates(callback) {
        this.firstUpdateTimeout = setTimeout(() => {
            callback();
            this.updateInterval = setInterval(callback, 1 * this.minutes);
            this.firstUpdateTimeout = null;
        }, 1 * this.minutes - new Date().getSeconds() * this.seconds);
    }
    datetime_formatReplace(formatStr, ordinal, dayjs, boundOldFormat) {
        return formatStr.replace(this.reFormat, (match) => {
            switch (match) {
                case "Mo":
                    return ordinal(dayjs.get("month") + 1);
                case "Qo":
                    return ordinal(parseInt(boundOldFormat("Q"), 10));
                case "DDD":
                    return index_js_1.Dayjs.prototype.dayOfYear().toString();
                case "DDDo":
                    return ordinal(dayjs.dayOfYear());
                case "DDDD":
                    return dayjs.dayOfYear().toString().padStart(3, "0");
                case "do":
                    return ordinal(parseInt(boundOldFormat("d")));
                case "e":
                    return dayjs.weekday().toString();
                case "eo":
                    return ordinal(dayjs.weekday());
                case "E":
                    return dayjs.isoWeekday().toString();
                case "Eo":
                    return ordinal(dayjs.isoWeekday());
                case "Wo":
                    return ordinal(parseInt(boundOldFormat("W"), 10));
                case "gg":
                    return dayjs.weekYear().toString().slice(-2);
                case "GG":
                    return dayjs.weekYear().toString().slice(-2);
                case "SSS":
                    return dayjs.get("millisecond").toString().padStart(3, "0");
                case "SS":
                    return Math.floor(dayjs.get("millisecond") / 10)
                        .toString()
                        .padStart(2, "0");
                case "S":
                    return Math.floor(dayjs.get("millisecond") / 100).toString();
                default:
                    return match;
            }
        });
    }
    datetime_dayjsSettings() {
        index_js_1.default?.extend(index_js_3.default);
        index_js_1.default?.extend(index_js_4.default);
        index_js_1.default?.extend(index_js_2.default);
        index_js_1.default?.extend(isoWeek_1.default);
        index_js_1.default?.extend(index_js_5.default);
        index_js_1.default?.extend(timezone_1.default);
        index_js_1.default?.extend(dayOfYear_1.default);
        index_js_1.default?.extend(index_js_6.default);
        index_js_1.default?.extend((_option, dayjsClass) => {
            const oldFormat = dayjsClass.prototype.format;
            dayjsClass.prototype.format = function (formatStr) {
                const ordinal = this.$locale().ordinal;
                const boundOldFormat = oldFormat.bind(this);
                if (!this.isValid()) {
                    return boundOldFormat(formatStr);
                }
                let result = "";
                const split = formatStr.split(DateTime.prototype.reEscape);
                for (let i = 0, len = split.length; i < len; i += 2) {
                    result +=
                        DateTime.prototype.datetime_formatReplace(split[i], ordinal, this, boundOldFormat) + (split[i + 1] || "");
                }
                return boundOldFormat(result);
            };
        });
    }
    datetime_scheduleUpdates() {
        this.datetime_startSchedule(this.datetime_updateDateTime);
    }
    datetime_showDateTime() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.datetime_updateDateTime();
        this.datetime_scheduleUpdates();
    }
    datetime_removeDateTime() {
        this.datetime_stopSchedule();
        this.datetime_removeStatusBarItem();
        this.isRunning = false;
    }
    datetime_copyDateTime() {
        vscode.env.clipboard.writeText(this.datetime_getDateTimeText(EDTFlashState_enum_cjs_1.EDTFlashState.on, EDTFormatType_enum_cjs_1.EDTFormatType.clipboard));
    }
    datetime_getDateTimeText(flashState, formatType) {
        let format;
        if (formatType === EDTFormatType_enum_cjs_1.EDTFormatType.clipboard) {
            format =
                this.datetime_getCustomFormat(EDTFlashState_enum_cjs_1.EDTFlashState.on, "clipboardFormat") ||
                    undefined;
        }
        if (!format) {
            format = this.datetime_getFormat(flashState);
        }
        let time;
        const timeZone = this.datetime_getTimeZone();
        if (typeof timeZone === "string") {
            time = (0, index_js_1.default)()
                .locale(this.datetime_getLocale())
                .tz(timeZone)
                .format(format);
        }
        else {
            time = (0, index_js_1.default)().locale(this.datetime_getLocale()).format(format);
        }
        return (this.datetime_getDisplayPrefix() + time + this.datetime_getDisplaySuffix());
    }
    datetime_updateDateTime() {
        if (this.datetime_hasFormat()) {
            let flashState;
            if (this.datetime_shouldFlashTimeSeparators()) {
                flashState = this.currentFlashState =
                    this.currentFlashState === EDTFlashState_enum_cjs_1.EDTFlashState.on
                        ? EDTFlashState_enum_cjs_1.EDTFlashState.off
                        : EDTFlashState_enum_cjs_1.EDTFlashState.on;
            }
            else {
                flashState = EDTFlashState_enum_cjs_1.EDTFlashState.on;
            }
            let shouldShow = false;
            if (!this.isStatusBarVisible) {
                this.datetime_createStatusBarItem();
                shouldShow = true;
            }
            if (!this.datetimeStatusBarItem) {
                return;
            }
            this.datetimeStatusBarItem.text = this.datetime_getDateTimeText(flashState, EDTFormatType_enum_cjs_1.EDTFormatType.status);
            if (shouldShow) {
                this.datetimeStatusBarItem.show();
            }
        }
        else {
            if (this.isStatusBarVisible) {
                this.datetime_removeStatusBarItem();
            }
        }
    }
    datetime_createStatusBarItem() {
        this.datetimeStatusBarItem = vscode.window.createStatusBarItem(this.datetime_getStatusBarAlignment(), this.datetime_getStatusBarPriority());
        this.datetimeStatusBarItem.command = "fd_dateTime.copy";
        this.isStatusBarVisible = true;
    }
    datetime_removeStatusBarItem() {
        if (this.datetimeStatusBarItem) {
            this.datetimeStatusBarItem.hide();
            this.datetimeStatusBarItem.dispose();
            this.datetimeStatusBarItem = undefined;
        }
        this.isStatusBarVisible = false;
    }
    datetime_workspace_settings() {
        vscode.workspace.onDidChangeConfiguration(() => {
            if (this.isRunning) {
                this.datetime_removeStatusBarItem();
                this.datetime_clearCache();
                this.datetime_updateDateTime();
                this.datetime_preCache();
                this.datetime_stopSchedule();
                this.datetime_scheduleUpdates();
            }
        });
    }
    datetime_activate(context) {
        this.datetime_dayjsSettings();
        context.subscriptions.push(vscode.commands.registerCommand("fd_dateTime.show", this.datetime_showDateTime));
        context.subscriptions.push(vscode.commands.registerCommand("fd_dateTime.hide", this.datetime_removeDateTime));
        context.subscriptions.push(vscode.commands.registerCommand("fd_dateTime.copy", this.datetime_copyDateTime));
        this.datetime_updateDateTime();
        if (!this.datetimeStatusBarItem) {
            return;
        }
        context.subscriptions.push(this.datetimeStatusBarItem);
        this.datetime_preCache();
        if (this.datetime_shouldShowOnStartup()) {
            vscode.commands.executeCommand("dateTime.show");
        }
        this.datetime_workspace_settings();
    }
    datetime_deactivate() {
        this.datetime_removeDateTime();
    }
}
exports.DateTime = DateTime;
