import { PluginFunc, ConfigType } from '../../index'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs/esm' {
  interface Dayjs {
    calendar(referenceTime?: ConfigType, formats?: object): string
  }
}
