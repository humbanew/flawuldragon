/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import Color from 'color';

export class CHSRgbwf {

  // Using [^\S\n] to avoid matching colors between lines. Using (?:;| |$) to avoid double matching with rgb() function
  public colorRgb = /([.\d]{1,5})[^\S\n]*(?<commaOrSpace>[^\S\n]|,)[^\S\n]*([.\d]{1,5})[^\S\n]*\k<commaOrSpace>[^\S\n]*([.\d]{1,5})(?:;| |$)/g;
  
  /**
   * @export
   * @param {string} text
   * @returns {{
   *  start: number,
   *  end: number,
   *  color: string
   * }}
   */
  public async findRgbNoFn(text: string) {
    let match = this.colorRgb.exec(text);
    let result = [];
  
    while (match !== null) {
      const [matchedColor, red, , green, blue] = match;
      const start = match.index + (match[0].length - matchedColor.length);
      const end = this.colorRgb.lastIndex;
  
      try {
        const color = Color.rgb(
          parseInt(red),
          parseInt(green),
          parseInt(blue)
        ).string();
  
        result.push({
          start,
          end,
          color
        });
      } catch (e) {
        console.error(e);
      }
  
      match = this.colorRgb.exec(text);
    }
  
    return result;
  }
}
