/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

import { CHSCssVars } from "./CHSCssVars";
import { CHSFunctions } from "./CHSFunctions";
import { CHSHex } from "./CHSHex";
import { CHSHsla } from "./CHSHsla";
import { CHSHslwf } from "./CHSHslwf";
import { CHSHwb } from "./CHSHwb";
import { CHSLessVars } from "./CHSLessVars";
import { CHSRgbwf } from "./CHSRgbwf";
import { CHSScssVars } from "./CHSScssVars";
import { CHSStylVars } from "./CHSStylVars";
import { CHSWords } from "./CHSWords";

export interface ICHStrategies {
  cssVars: CHSCssVars;
  functions: CHSFunctions;
  hex: CHSHex;
  hsla: CHSHsla;
  hslWithoutFunction: CHSHslwf;
  hwb: CHSHwb;
  lessVars: CHSLessVars;
  rgbWithoutFunction: CHSRgbwf;
  scssVars: CHSScssVars;
  stylVars: CHSStylVars;
  words: CHSWords;
}
