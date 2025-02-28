/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

/// <reference types="node" />

export declare interface ITHAnnotation {
  uri: string;
  label: string;
  detail: string;
  lineNum: number;
  fileName: string;
  startCol: number;
  endCol: number;
}

export declare interface ITHAnnotations {
  [key: string]: ITHAnnotation[];
}

export declare interface ITHAnnotationsFoundError {
  message: string;
}

export declare interface ITHAnnotationType {
  annotationType: string;
  label: string;
  description?: string;
}

// get the include/exclude config
export declare interface ITHConfig {
  include?: string | string[];
  exclude?: string | string[];
}

export declare interface ITHErrorHandler {
  (err: any): void;
}

export declare interface ITHKeyword {
  text: string;
  color?: string;
  backgroundColor?: string;
  overviewRulerColor?: string;
}
