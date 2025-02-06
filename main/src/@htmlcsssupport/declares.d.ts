/// <reference types="node" />

import { HCSPsrStyleType } from "./enums";

export declare interface HCSPsrStyle {
  index: number;
  line: number;
  col: number;
  type: HCSPsrStyleType;
  selector: string;
}
