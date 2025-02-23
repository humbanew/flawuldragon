/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import Color from 'color';

export class CHSHwb {
  public colorHwb = /((hwb)\(\d+,\s*(100|0*\d{1,2})%,\s*(100|0*\d{1,2})%(,\s*0?\.?\d+)?\))/gi;
  
  /**
   * @export
   * @param {string} text
   * @returns {{
   *  start: number,
   *  end: number,
   *  color: string
   * }}
   */
  public async findHwb(text: string) {
    let match = this.colorHwb.exec(text);
    let result = [];
  
    while (match !== null) {
      const start = match.index;
      const end = this.colorHwb.lastIndex;
      const matchedColor = match[0];
  
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
  
      match = this.colorHwb.exec(text);
    }
  
    return result;
  }
}
