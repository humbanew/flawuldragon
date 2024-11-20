import { PluginFunc } from '../../index'

declare module 'dayjs/esm' {
  interface ConfigTypeMap {
    arraySupport: [number?, number?, number?, number?, number?, number?, number?]
  }
}

declare const plugin: PluginFunc
export = plugin
