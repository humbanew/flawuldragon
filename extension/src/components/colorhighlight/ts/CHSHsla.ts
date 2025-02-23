/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

export class CHSHsla {
  public colorHsla = /(hsla?\([\d]{1,3},\s*[\d]{1,3}%,\s*[\d]{1,3}%(,\s*\d?\.?\d+)?\))/gi;

  /**
   * @export
   * @param {string} text
   * @returns {{
   *  start: number,
   *  end: number,
   *  color: string
   * }}
   */
  public async findHsla(text: string) {
    let match = this.colorHsla.exec(text);
    let result = [];
  
    while (match !== null) {
      const start = match.index;
      const end = this.colorHsla.lastIndex;
      const color = match[0];
  
      result.push({
        start,
        end,
        color
      });
  
      match = this.colorHsla.exec(text);
    }
  
    return result;
  }

}
