import { PluginFunc } from '../index'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs' {
  interface Dayjs {
    weekday(): number

    weekday(value: number): Dayjs
  }
}
