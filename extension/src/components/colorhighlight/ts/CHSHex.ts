import Color from 'color';

export class CHSHex {
  public colorHex =
    /.?((?:\#|\b0x)([a-f0-9]{6}([a-f0-9]{2})?|[a-f0-9]{3}([a-f0-9]{1})?))\b/gi;

  /**
   * @export
   * @param {string} text
   * @returns {Array<{
   *  start: number,
   *  end: number,
   *  color: string
   * }>}
   */
  public findHex(text: any, useARGB: boolean): Array<{
    start: number;
    end: number;
    color: string;
  }> {
    let match = this.colorHex.exec(text);
    let result: { start: number; end: number; color: string; }[] = [];

    while (match !== null) {
      const firstChar = match[0][0];
      const matchedColor = match[1];
      const start = match.index + (match[0].length - matchedColor.length);
      const end = this.colorHex.lastIndex;
      let matchedHex = '#' + match[2];

      // Check the symbol before the color match, and try to avoid coloring in the
      // contexts that are not relevant
      // https://github.com/sergiirocks/vscode-ext-color-highlight/issues/25
      if (firstChar.length && /\w/.test(firstChar)) {
        match = this.colorHex.exec(text);
        continue;
      }

      try {
        let color;
        if (useARGB == true) {
          let alphaInt = 1;
          if (match[2].length == 8) {
            alphaInt =
              Math.round((parseInt(match[2].substring(0, 2), 16) * 100) / 255) /
              100; // Get first 2 characters, convert to decimal
            matchedHex = '#' + match[2].substring(2);
          }

          color = Color(matchedHex).alpha(alphaInt).rgb().string();
        } else {
          color = Color(matchedHex).rgb().string();
        }

        result.push({
          start,
          end,
          color,
        });
      } catch (e) { }

      match = this.colorHex.exec(text);
    }

    return result;
  }

  /**
   * @export
   * @param {string} text
   * @returns {{
   *  start: number,
   *  end: number,
   *  color: string
   * }}
   */
  public async findHexARGB(text: any): Promise<{ start: number; end: number; color: string; }[]> {
    return this.findHex(text, true);
  }

  /**
   * @export
   * @param {string} text
   * @returns {{
   *  start: number,
   *  end: number,
   *  color: string
   * }}
   */
  public async findHexRGBA(text: any): Promise<{ start: number; end: number; color: string; }[]> {
    return this.findHex(text, false);
  }

}
