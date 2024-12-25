/// <reference types="node" />

import { ARTHTMLScannerService } from "./ARTHTMLScannerService.ac.cts";
import { EARTSScannerStateFast } from "./EARTSScannerStateFast.cts";
import { EARTSTokenTypeFast } from "./EARTSTokenTypeFast.cts";

export declare interface IARTSScannerFast {
  readonly scan: () => EARTSTokenTypeFast;
  readonly getTokenText: () => string;
  readonly stream: typeof ARTHTMLScannerService.call.prototype.multilinestream;
  state: EARTSScannerStateFast;
}
