import * as vscode from "vscode";
import { EDTFormatType } from "./EDTFormatType.enum.cjs";
import { EDTFlashState } from "./EDTFlashState.enum.cjs";
import dayjs, { Dayjs } from "./dayjs/esm/index.js";
import weekOfYear from "./dayjs/esm/plugin/weekOfYear/index.js";
import weekday from "./dayjs/esm/plugin/weekday/index.js";
import weekYear from "./dayjs/esm/plugin/weekYear/index.js";
import isoWeek from "./dayjs/esm/plugin/isoWeek";
import utc from "./dayjs/esm/plugin/utc/index.js";
import timezone from "./dayjs/esm/plugin/timezone";
import dayOfYear from "./dayjs/esm/plugin/dayOfYear";
import advancedFormat from "./dayjs/esm/plugin/advancedFormat/index.js";

export class DateTime {
  private cache: {
    format: {
      [EDTFlashState.on]: string | null;
      [EDTFlashState.off]: string | null;
    };
    configuration: {
      [key: string]: any;
    };
  } = this.datetime_getDefaultCache();
  private timeCharacters = "HhmSs";
  private seconds = 1000;
  private minutes = 60 * this.seconds;
  private firstUpdateTimeout: any;
  private updateInterval: any;
  private reEscape = /(\[.+?\])/;
  private reFormat = /Mo|Qo|DDDD|DDDo?|do|eo?|Eo?|Wo|gggg|gg|GGGG|GG|SSS|SS|S/g;
  private datetimeStatusBarItem: vscode.StatusBarItem | undefined;
  private isRunning = false;
  private isStatusBarVisible = false;
  private currentFlashState: EDTFlashState;
  private type_dayjs: typeof dayjs;

  private datetime_getDefaultCache(): any {
    return {
      format: {
        [EDTFlashState.on]: null,
        [EDTFlashState.off]: null,
      },
      configuration: {},
    };
  }

  private datetime_preCache() {
    if (!this.cache.format[EDTFlashState.on]) {
      this.datetime_getFormat(EDTFlashState.on);
    }

    if (
      !this.cache.format[EDTFlashState.off] &&
      this.datetime_shouldFlashTimeSeparators()
    ) {
      this.datetime_getFormat(EDTFlashState.off);
    }
  }

  private datetime_clearCache() {
    this.cache = this.datetime_getDefaultCache();
  }

  private datetime_getConfiguration(property: string) {
    if (!this.cache.configuration.hasOwnProperty(property)) {
      this.cache.configuration[property] =
        vscode.workspace.getConfiguration("dateTime")[property];
    }
    return this.cache.configuration[property];
  }

  private datetime_shouldShowOnStartup(): boolean {
    return this.datetime_getConfiguration("showOnStartup");
  }

  private datetime_getCustomFormat(
    flashState: EDTFlashState,
    property = "customFormat",
  ): string | null {
    const format = this.datetime_getConfiguration(property);

    if (!format) {
      return null;
    }

    if (flashState === EDTFlashState.on) {
      return format;
    } else {
      const reSeparator = this.datetime_getFormatTimeSeparatorRegExp();
      return format.replace(
        reSeparator,
        "$1" + this.datetime_getTimeSeparatorOff(),
      );
    }
  }

  private datetime_hasCustomFormat(): boolean {
    return this.datetime_getCustomFormat(EDTFlashState.on) !== null;
  }

  private datetime_getLocale(): string {
    return this.datetime_getConfiguration("locale") || vscode.env.language;
  }

  private datetime_getTimeZone(): string | null {
    return this.datetime_getConfiguration("timeZone") || null;
  }

  private datetime_getFormatTimeSeparatorRegExp(): RegExp {
    const separator = this.datetime_escapeRegExp(
      this.datetime_getTimeSeparator(),
    );
    return new RegExp(
      `([${this.timeCharacters}]+[^${this.timeCharacters}${separator}]*)${separator}`,
      "g",
    );
  }

  private datetime_shouldShowHours(): boolean {
    return this.datetime_getConfiguration("showHours");
  }

  private datetime_shouldShowMinutes(): boolean {
    return this.datetime_getConfiguration("showMinutes");
  }

  private datetime_shouldShowSeconds(): boolean {
    const customFormat = this.datetime_getCustomFormat(EDTFlashState.on);
    if (customFormat && customFormat.indexOf("s") > -1) {
      return true;
    }
    return this.datetime_getConfiguration("showSeconds");
  }

  private datetime_shouldShowFractionalSeconds(): boolean {
    return this.datetime_getFormat(EDTFlashState.on).indexOf("S") > -1;
  }

  private datetime_getFractionalPrecision(): number {
    let precision: number = this.datetime_getConfiguration(
      "fractionalPrecision",
    );

    if (typeof precision !== "number") {
      const format = this.datetime_getFormat(EDTFlashState.on);

      let exponent = (format.match(/S/g) || []).length;

      if (exponent === 0) {
        exponent = format.indexOf("x") > -1 ? 3 : 0;
      }

      precision = Math.pow(10, exponent);
    }

    if (precision < 1) {
      precision = 1;
    } else if (precision > 100) {
      precision = 100;
    }

    return precision;
  }

  private datetime_shouldShowDayOfWeek(): boolean {
    return this.datetime_getConfiguration("showDayOfWeek");
  }

  private datetime_shouldShowDayOfMonth(): boolean {
    return this.datetime_getConfiguration("showDayOfMonth");
  }

  private datetime_shouldShowMonth(): boolean {
    return this.datetime_getConfiguration("showMonth");
  }

  private datetime_shouldUse24HourClock(): boolean {
    return this.datetime_getConfiguration("use24HourClock");
  }

  private datetime_shouldShowAMPM(): boolean {
    return this.datetime_getConfiguration("showAMPM");
  }

  private datetime_shouldPadHours(): boolean {
    return this.datetime_getConfiguration("padHours");
  }

  private datetime_shouldPadMinutes(): boolean {
    return this.datetime_getConfiguration("padMinutes");
  }

  private datetime_shouldPadSeconds(): boolean {
    return this.datetime_getConfiguration("padSeconds");
  }

  private datetime_shouldPadDays(): boolean {
    return this.datetime_getConfiguration("padDays");
  }

  private datetime_getTimeSeparator(): string {
    return this.datetime_getConfiguration("timeSeparator");
  }

  private datetime_getTimeSeparatorOff(): string {
    return this.datetime_getConfiguration("timeSeparatorOff");
  }

  private datetime_shouldFlashTimeSeparators(): boolean {
    return this.datetime_getConfiguration("flashTimeSeparators");
  }

  private datetime_getFormat(flashState: EDTFlashState): string {
    if (!this.cache.format[flashState]) {
      this.cache.format[flashState] =
        this.datetime_getCustomFormat(flashState) ||
        this.datetime_composeFormat(flashState);
    }

    return this.cache.format[flashState]!;
  }

  private datetime_hasFormat(): boolean {
    return this.datetime_getFormat(EDTFlashState.on).length > 0;
  }

  private datetime_composeFormat(flashState: EDTFlashState): string {
    const separator =
      flashState === EDTFlashState.on
        ? this.datetime_getTimeSeparator()
        : this.datetime_getTimeSeparatorOff();

    let format = "";

    if (this.datetime_shouldShowHours()) {
      if (this.datetime_shouldUse24HourClock()) {
        format += this.datetime_shouldPadHours() ? "HH" : "H";
      } else {
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

  private datetime_getStatusBarAlignment(): vscode.StatusBarAlignment {
    return this.datetime_getConfiguration("statusBarAlignment") === "left"
      ? vscode.StatusBarAlignment.Left
      : vscode.StatusBarAlignment.Right;
  }

  private datetime_getStatusBarPriority(): number {
    const configuredPriority =
      this.datetime_getConfiguration("statusBarPriority");
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

  private datetime_getDisplayPrefix(): string {
    return this.datetime_getConfiguration("displayPrefix") || "";
  }

  private datetime_getDisplaySuffix(): string {
    return this.datetime_getConfiguration("displaySuffix") || "";
  }

  private datetime_escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private datetime_startSchedule(callback: () => void) {
    const format = this.datetime_getFormat(EDTFlashState.on);

    if (
      this.datetime_shouldShowFractionalSeconds() ||
      format.indexOf("x") > -1
    ) {
      this.datetime_scheduleMillisecondUpdates(callback);
    } else if (
      this.datetime_shouldShowSeconds() ||
      this.datetime_shouldFlashTimeSeparators() ||
      format.indexOf("X") > -1
    ) {
      this.datetime_scheduleSecondUpdates(callback);
    } else {
      this.datetime_scheduleMinuteUpdates(callback);
    }
  }

  private datetime_stopSchedule() {
    if (this.firstUpdateTimeout) {
      clearTimeout(this.firstUpdateTimeout);
      this.firstUpdateTimeout = null;
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private datetime_scheduleMillisecondUpdates(callback: () => void) {
    this.updateInterval = setInterval(
      callback,
      (1 / this.datetime_getFractionalPrecision()) * this.seconds,
    );
  }

  private datetime_scheduleSecondUpdates(callback: () => void) {
    this.updateInterval = setInterval(callback, 1 * this.seconds);
  }

  private datetime_scheduleMinuteUpdates(callback: () => void) {
    this.firstUpdateTimeout = setTimeout(() => {
      callback();
      this.updateInterval = setInterval(callback, 1 * this.minutes);
      this.firstUpdateTimeout = null;
    }, 1 * this.minutes - new Date().getSeconds() * this.seconds);
  }

  private datetime_formatReplace(
    formatStr: string,
    ordinal: (number: number) => string,
    dayjs: dayjs.Dayjs,
    boundOldFormat: (template?: string | undefined) => string,
  ): string {
    return formatStr.replace(this.reFormat, (match) => {
      switch (match) {
        case "Mo":
          return ordinal(dayjs.get("month") + 1);
        case "Qo":
          return ordinal(parseInt(boundOldFormat("Q"), 10));
        case "DDD":
          return Dayjs.prototype.dayOfYear().toString();
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

  private datetime_dayjsSettings() {
    dayjs?.extend(weekday);
    dayjs?.extend(weekYear);
    dayjs?.extend(weekOfYear);
    dayjs?.extend(isoWeek);
    dayjs?.extend(utc);
    dayjs?.extend(timezone);
    dayjs?.extend(dayOfYear);
    dayjs?.extend(advancedFormat);
    dayjs?.extend((_option, dayjsClass) => {
      const oldFormat = dayjsClass.prototype.format;

      dayjsClass.prototype.format = function (
        this: Dayjs,
        formatStr: string,
      ): string {
        const ordinal = (this as any).$locale().ordinal as (
          number: number,
        ) => string;

        const boundOldFormat = oldFormat.bind(this);

        if (!this.isValid()) {
          return boundOldFormat(formatStr);
        }

        let result = "";

        const split = formatStr.split(DateTime.prototype.reEscape);
        for (let i = 0, len = split.length; i < len; i += 2) {
          result +=
            DateTime.prototype.datetime_formatReplace(
              split[i],
              ordinal,
              this,
              boundOldFormat,
            ) + (split[i + 1] || "");
        }

        return boundOldFormat(result);
      };
    });
  }

  private datetime_scheduleUpdates() {
    this.datetime_startSchedule(this.datetime_updateDateTime);
  }

  private datetime_showDateTime() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.datetime_updateDateTime();
    this.datetime_scheduleUpdates();
  }

  private datetime_removeDateTime() {
    this.datetime_stopSchedule();
    this.datetime_removeStatusBarItem();
    this.isRunning = false;
  }

  private datetime_copyDateTime() {
    vscode.env.clipboard.writeText(
      this.datetime_getDateTimeText(EDTFlashState.on, EDTFormatType.clipboard),
    );
  }

  private datetime_getDateTimeText(
    flashState: EDTFlashState,
    formatType: EDTFormatType,
  ): string {
    let format: string | undefined;

    if (formatType === EDTFormatType.clipboard) {
      format =
        this.datetime_getCustomFormat(EDTFlashState.on, "clipboardFormat") ||
        undefined;
    }

    if (!format) {
      format = this.datetime_getFormat(flashState);
    }

    let time: dayjs.Dayjs | string;

    const timeZone = this.datetime_getTimeZone();
    if (typeof timeZone === "string") {
      time = dayjs()
        .locale(this.datetime_getLocale())
        .tz(timeZone)
        .format(format);
    } else {
      time = dayjs().locale(this.datetime_getLocale()).format(format);
    }

    return (
      this.datetime_getDisplayPrefix() + time + this.datetime_getDisplaySuffix()
    );
  }

  private datetime_updateDateTime() {
    if (this.datetime_hasFormat()) {
      let flashState: EDTFlashState;

      if (this.datetime_shouldFlashTimeSeparators()) {
        flashState = this.currentFlashState =
          this.currentFlashState === EDTFlashState.on
            ? EDTFlashState.off
            : EDTFlashState.on;
      } else {
        flashState = EDTFlashState.on;
      }

      let shouldShow = false;
      if (!this.isStatusBarVisible) {
        this.datetime_createStatusBarItem();
        shouldShow = true;
      }

      if (!this.datetimeStatusBarItem) {
        return;
      }

      this.datetimeStatusBarItem.text = this.datetime_getDateTimeText(
        flashState,
        EDTFormatType.status,
      );

      if (shouldShow) {
        this.datetimeStatusBarItem.show();
      }
    } else {
      if (this.isStatusBarVisible) {
        this.datetime_removeStatusBarItem();
      }
    }
  }

  private datetime_createStatusBarItem() {
    this.datetimeStatusBarItem = vscode.window.createStatusBarItem(
      this.datetime_getStatusBarAlignment(),
      this.datetime_getStatusBarPriority(),
    );
    this.datetimeStatusBarItem.command = "fd_dateTime.copy";
    this.isStatusBarVisible = true;
  }

  private datetime_removeStatusBarItem() {
    if (this.datetimeStatusBarItem) {
      this.datetimeStatusBarItem.hide();
      this.datetimeStatusBarItem.dispose();
      this.datetimeStatusBarItem = undefined;
    }
    this.isStatusBarVisible = false;
  }

  private datetime_workspace_settings() {
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

  public datetime_activate(context: vscode.ExtensionContext) {
    this.datetime_dayjsSettings();

    context.subscriptions.push(
      vscode.commands.registerCommand("fd_dateTime.show", this.datetime_showDateTime),
    );

    context.subscriptions.push(
      vscode.commands.registerCommand("fd_dateTime.hide", this.datetime_removeDateTime),
    );

    context.subscriptions.push(
      vscode.commands.registerCommand("fd_dateTime.copy", this.datetime_copyDateTime),
    );

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

  public datetime_deactivate() {
    this.datetime_removeDateTime();
  }
}
