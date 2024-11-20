import { PluginFunc, ConfigType } from '../index'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    tz(timezone?: string, keepLocalTime?: boolean): Dayjs
    offsetName(type?: 'short' | 'long'): string | undefined
  }

  interface DayjsTimezone {
    (date?: ConfigType, timezone?: string): Dayjs
    (date: ConfigType, format: string, timezone?: string): Dayjs
    guess(): string
    setDefault(timezone?: string): void
  }

  const tz: DayjsTimezone
}
