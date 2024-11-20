import { PluginFunc, ConfigType, OpUnitType } from '../../index'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs/esm' {
  interface Dayjs {
    isSameOrBefore(date?: ConfigType, unit?: OpUnitType): boolean
  }
}
