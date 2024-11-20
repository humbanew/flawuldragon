import { PluginFunc } from '../../index'

declare const plugin: PluginFunc
export = plugin

declare module 'dayjs/esm' {

  export function isMoment(input: any): boolean

}
