/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

export class CHSFunctions {
  public colorRegex = /((rgb|hsl|lch|oklch)a?\(\s*[\d]*\.?[\d]+%?\s*(?<commaOrSpace>\s|,)\s*[\d]*\.?[\d]+%?\s*\k<commaOrSpace>\s*[\d]*\.?[\d]+%?(\s*(\k<commaOrSpace>|\/)\s*[\d]*\.?[\d]+%?)?\s*\))/gi;
  public cssVarRegex = /(--[\w-]+-(rgb|hsl|lch|oklch)):\s*([\d]*\.?[\d]+\s+[\d]*\.?[\d]+\s+[\d]*\.?[\d]+);/gi;
  public allowedColorFunctions = ['rgb', 'hsl', 'lch', 'oklch'];

  public async findColorFunctionsInText(text: string) {
    const colorMatches = [...text.matchAll(this.colorRegex)];
    const cssVarMatches = [...text.matchAll(this.cssVarRegex)];

    return [...colorMatches, ...cssVarMatches].map(this.createColorFunctionObject);
  }

  public createColorFunctionObject(match: any) {
    const start = match.index;
    const end = start + match[0].length;
    let color = match[0];

    const cssVarMatchArray = Array.from(color.matchAll(this.cssVarRegex));

    if (cssVarMatchArray.length > 0) {
      const cssVarMatch: any = cssVarMatchArray[0];
      const colorFunction = cssVarMatch[2];
      const colorValues = cssVarMatch[3];

      if (this.allowedColorFunctions.includes(colorFunction)) {
        color = `${colorFunction}(${colorValues})`;
      }
    }

    return { start, end, color };
  }

  public sortStringsInDescendingOrder(strings: any[]) {
    return strings.sort((a: any, b: string) => b.localeCompare(a));
  }

}
