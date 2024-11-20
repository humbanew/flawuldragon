import { PluginFunc } from '../../index'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs/esm' {
  interface Dayjs {
    dayOfYear(): number
    dayOfYear(value: number): Dayjs
  }
}
