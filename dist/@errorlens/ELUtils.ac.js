"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELUtils = void 0;
// utils/utils.ts
class ELUtils {
    constructor() { }
    /**
     * Cut off string if it's longer than provided number of characters.
     */
    truncateString(str, max) {
        const chars = [...str];
        return chars.length > max ? `${chars.slice(0, max).join('')}…` : str;
    }
    /**
     * Replace linebreaks with the one whitespace symbol.
     */
    replaceLinebreaks(str, replaceSymbol) {
        return str.replace(/[\n\r\t]+/gu, replaceSymbol);
    }
    /**
     * To work on the web - use this instead of `path.basename`.
     */
    basename(filePath) {
        return filePath.split(/[\\/]/u).pop() ?? '';
    }
    /**
     * Add text at the start and at the end.
     */
    surround(str, surroundStr) {
        return `${surroundStr}${str}${surroundStr}`;
    }
}
exports.ELUtils = ELUtils;
