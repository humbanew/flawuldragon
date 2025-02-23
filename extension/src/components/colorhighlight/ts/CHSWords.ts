/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import Color from 'color';
import webColors from 'color-name';

export class CHSWords {

  public preparedRePart = Object.keys(webColors)
    .map(color => `\\b${color}\\b`)
    .join('|');
  
  public colorWeb = new RegExp('.?(' + this.preparedRePart + ')(?!-)', 'g');
  
  /**
   * @export
   * @param {string} text
   * @returns {{
   *  start: number,
   *  end: number,
   *  color: string
   * }}
   */
  public async findWords(text: string) {
    let match = this.colorWeb.exec(text);
    let result = [];
  
    while (match !== null) {
      const firstChar = match[0][0];
      const matchedColor = match[1];
      const start = match.index + (match[0].length - matchedColor.length);
      const end = this.colorWeb.lastIndex;
  
      if (firstChar.length && /[-\\$@#]/.test(firstChar)) {
        match = this.colorWeb.exec(text);
        continue;
      }
  
      try {
        const color = Color(matchedColor)
          .rgb()
          .string();
  
        result.push({
          start,
          end,
          color
        });
      } catch (e) { }
  
      match = this.colorWeb.exec(text);
    }
  
    return result;
  }
}
