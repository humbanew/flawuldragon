import { PluginFunc } from '../../index'

declare interface PluginOptions {
    parseTwoDigitYear?: (yearString: string) => number
}

declare const plugin: PluginFunc<PluginOptions>
export = plugin
