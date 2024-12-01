declare interface IDJSLocale {
  name: string;
  language: string;
  weekdays?: string[];
  months?: string[];
  weekStart?: number;
  yearStart?: number;
  weekdaysShort?: string[];
  monthsShort?: string[];
  weekdaysMin?: string[];
  ordinal?: (n: number) => number | string;
  preparse?: (str: string) => string;
  postformat?: (str: string) => string;
  formats?: Partial<{
    LT: string;
    LTS: string;
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;
    l?: string;
    ll?: string;
    lll?: string;
    llll?: string;
  }>;
  relativeTime?: Partial<{
    future: string;
    past: string;
    s:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[]);
    m:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[]);
    mm:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[])
      | ((number: number, key: any, withoutSuffix: any) => string);
    h:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[]);
    hh:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[]);
    d:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[]);
    dd:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[])
      | ((number: number, key: any, withoutSuffix: any) => string);
    M:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[]);
    MM:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[])
      | ((number: number, key: any, withoutSuffix: any) => string);
    y:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[]);
    yy:
      | string
      | ((number: number, withoutSuffix: any, key: any, isFuture: any) => string|string[])
      | ((number: number, key: any, withoutSuffix: any) => string);
  }>;
  meridiem?: (hour: number, minute: number, isLowercase: boolean) => string;
}
