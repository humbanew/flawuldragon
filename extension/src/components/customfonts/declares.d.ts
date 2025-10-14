/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

/// <reference types="node" />

/**
 * Represents a general object with string keys and values that can be of type string, number, boolean, or another IJBMGeneralObject.
 * 
 * @interface IJBMGeneralObject
 * @property {string | number | boolean | IJBMGeneralObject} [index] - The value associated with the key, which can be a string, number, boolean, or another IJBMGeneralObject.
 */
export declare interface IJBMGeneralObject {
  [index: string]: string | number | boolean | IJBMGeneralObject;
}

export declare interface IFDCustomFontsSetupConfig {
  "actual-customfonts-statusbar-text": string;
  "actual-customfonts-statusbar-tooltip": string;
}
