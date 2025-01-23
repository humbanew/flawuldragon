import { findHexRGBA } from './hex.js';
import { findWords } from './words.js';
import { findColorFunctionsInText, sortStringsInDescendingOrder } from './functions.js';
import { findHwb } from './hwb.js';
import { parseImports } from '../lib/sass-importer.js';

const setVariable = /^\s*\$([-\w]+)\s*:\s*(.*)$/gm;

/**
 * @export
 * @param {string} text
 * @returns {{
 *  start: number,
 *  end: number,
 *  color: string
 * }}
 */
export async function findScssVars(text, importerOptions) {
  let textWithImports = text;

  try {
    textWithImports = await parseImports(importerOptions);
  } catch(err) {
    console.log('Error during imports loading, falling back to local variables parsing');
  }

  let match = setVariable.exec(textWithImports);
  let result = [];

  const varColor = {};
  let varNames = [];

  while (match !== null) {
    const name = match[1];
    const value = match[2];
    const values = await Promise.race([
      findHexRGBA(value),
      findWords(value),
      findColorFunctionsInText(value),
      findHwb(value)
    ]);

    if (values.length) {
      varNames.push(name);
      varColor[name] = values[0].color;
    }

    match = setVariable.exec(textWithImports);
  }

  if (!varNames.length) {
    return [];
  }

  varNames = sortStringsInDescendingOrder(varNames);

  const varNamesRegex = new RegExp(`\\$(${varNames.join('|')})(?!-|\\s*:)`, 'g');

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
