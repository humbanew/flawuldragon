import { PluginFunc, ConfigType } from '../../index'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs/esm' {
  interface Dayjs {
    
    utc(keepLocalTime?: boolean): Dayjs
    
    local(): Dayjs

    isUTC(): boolean

    utcOffset(offset: number | string, keepLocalTime?: boolean): Dayjs
  }

  export function utc(config?: ConfigType, format?: string, strict?: boolean): Dayjs
}
