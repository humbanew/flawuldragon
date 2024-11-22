import * as vscode from "vscode";

abstract class DayJS {
  // clock constants
  protected SECONDS_A_MINUTE = 60;
  protected SECONDS_A_HOUR = this.SECONDS_A_MINUTE * 60;
  protected SECONDS_A_DAY = this.SECONDS_A_HOUR * 24;
  protected SECONDS_A_WEEK = this.SECONDS_A_DAY * 7;
  protected MILLISECONDS_A_SECOND = 1e3;
  protected MILLISECONDS_A_MINUTE =
    this.SECONDS_A_MINUTE * this.MILLISECONDS_A_SECOND;
  protected MILLISECONDS_A_HOUR =
    this.SECONDS_A_HOUR * this.MILLISECONDS_A_SECOND;
  protected MILLISECONDS_A_DAY =
    this.SECONDS_A_DAY * this.MILLISECONDS_A_SECOND;
  protected MILLISECONDS_A_WEEK =
    this.SECONDS_A_WEEK * this.MILLISECONDS_A_SECOND;

  // english locales
  protected MS = "millisecond";
  protected S = "second";
  protected MIN = "minute";
  protected H = "hour";
  protected D = "day";
  protected W = "week";
  protected M = "month";
  protected Q = "quarter";
  protected Y = "year";
  protected DATE = "date";
  protected FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ssZ";
  protected INVALID_DATE_STRING = "Invalid Date";

  // regex
  protected REGEX_PARSE =
    /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
  protected REGEX_FORMAT =
    /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

  // utils props
  protected dayjs_padStart(string: any, length: number, pad: string) {
    const s = String(string);
    if (!s || s.length >= length) return string;
    return `${Array(length + 1 - s.length).join(pad)}${string}`;
  }

  protected dayjs_padZoneStr(instance: { utcOffset: () => number }) {
    const negMinutes = -instance.utcOffset();
    const minutes = Math.abs(negMinutes);
    const hourOffset = Math.floor(minutes / 60);
    const minuteOffset = minutes % 60;
    return `${negMinutes <= 0 ? "+" : "-"}${this.dayjs_padStart(
      hourOffset,
      2,
      "0",
    )}:${this.dayjs_padStart(minuteOffset, 2, "0")}`;
  }

  protected dayjs_monthDiff(a: any, b: any): any {
    // function from moment.js in order to keep the same result
    if (a.date() < b.date()) return this.dayjs_monthDiff(b, a);
    const wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
    const anchor = a.clone().add(wholeMonthDiff, this.M);
    const c = b - anchor < 0;
    const anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), this.M);
    return +(
      -(
        wholeMonthDiff +
        (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)
      ) || 0
    );
  }

  protected dayjs_absFloor(n: any) {
    n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
  }

  protected dayjs_prettyUnit(u: number | string): any {
    const special = {
      M: this.M,
      y: this.Y,
      w: this.W,
      d: this.D,
      D: this.DATE,
      h: this.H,
      m: this.MIN,
      s: this.S,
      ms: this.MS,
      Q: this.Q,
    };
    return (
      special[u as keyof typeof special] ||
      String(u || "")
        .toLowerCase()
        .replace(/s$/, "")
    );
  }

  protected dayjs_isUndefined(s: any) {
    s == undefined;
  }
}

export class DateTime extends DayJS {
  public datetime_activate(context: vscode.ExtensionContext) {}
  public datetime_deactivate() {}
}
