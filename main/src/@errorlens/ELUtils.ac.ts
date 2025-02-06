// utils/utils.ts
export class ELUtils {
  public constructor(){}
  /**
   * Cut off string if it's longer than provided number of characters.
   */
  public truncateString(str: string, max: number): string {
    const chars = [...str];
    return chars.length > max ? `${chars.slice(0, max).join('')}…` : str;
  }
  /**
   * Replace linebreaks with the one whitespace symbol.
   */
  public replaceLinebreaks(str: string, replaceSymbol: string): string {
    return str.replace(/[\n\r\t]+/gu, replaceSymbol);
  }
  /**
   * To work on the web - use this instead of `path.basename`.
   */
  public basename(filePath: string): string {
    return filePath.split(/[\\/]/u).pop() ?? '';
  }
  /**
   * Add text at the start and at the end.
   */
  public surround(str: string, surroundStr: string): string {
    return `${surroundStr}${str}${surroundStr}`;
  }
}
