/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import { CHSFunctions } from "./CHSFunctions";
import { CHSHex } from "./CHSHex";
import { CHSHwb } from "./CHSHwb";
import { CHSWords } from "./CHSWords";

export class CHSLessVars {

  public setVariable = /^\s*\@([-\w]+)\s*:\s*(.*)$/gm;
  
  /**
   * @export
   * @param {string} text
   * @returns {{
   *  start: number,
   *  end: number,
   *  color: string
   * }}
   */
  public async findLessVars(text: string) {
    let match = this.setVariable.exec(text);
    let result = [];
  
    const varColor: { [key: string]: string } = {};
    let varNames = [];
  
    while (match !== null) {
      const name = match[1];
      const value = match[2];
      const values = await Promise.race([
        CHSHex.prototype.findHexRGBA(value),
        CHSWords.prototype.findWords(value),
        CHSFunctions.prototype.findColorFunctionsInText(value),
        CHSHwb.prototype.findHwb(value)
      ]);
  
      if (values.length) {
        varNames.push(name);
        varColor[name] = values[0].color;
      }
  
      match = this.setVariable.exec(text);
    }
  
    if (!varNames.length) {
      return [];
    }
  
    varNames = CHSFunctions.prototype.sortStringsInDescendingOrder(varNames);
  
    const varNamesRegex = new RegExp(`\\@(${varNames.join('|')})(?!-|\\s*:)`, 'g');
  
    match = varNamesRegex.exec(text);
  
    while (match !== null) {
      const start = match.index;
      const end = varNamesRegex.lastIndex;
      const varName = match[1];
  
      result.push({
        start,
        end,
        color: varColor[varName]
      });
  
      match = varNamesRegex.exec(text);
    }
  
  
    return result;
  }
}
