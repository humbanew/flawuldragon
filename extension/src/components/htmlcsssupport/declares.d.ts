/**
 * ========================================================================================
 * Humbanew Project ©️ 2023-2025
 * All rights reserved.
 * Licensed under the MIT License, adapted.
 * ========================================================================================
 */

/// <reference types="node" />

import { HCSPsrStyleType } from "./enums";

export declare interface HCSPsrStyle {
  index: number;
  line: number;
  col: number;
  type: HCSPsrStyleType;
  selector: string;
}
