/// <reference types="node"/>

import { VersionedTextDocumentIdentifier } from "vscode-languageserver";
import { EARCCTSvcHSTokenTypeFast, EARCCTSvcHSScannerStateFast } from "./enums";
import { Code2ProtocolConverter, RequestType } from "vscode-languageclient";
import { ARTSvcHtmlScanner } from "./AutoSvcHtmlScanner.ac";

export declare interface IARCCTSvcHSScannerFast {
  readonly scan: () => EARCCTSvcHSTokenTypeFast;
  readonly getTokenText: () => string;
  readonly stream: ARTSvcHtmlScanner;
  state: EARCCTSvcHSScannerStateFast;
}

export declare interface IARCCTSTag {
  readonly word: string;
  readonly oldWord: string;
  readonly offset: number;
}

export declare interface IARCCTSParams {
  readonly textDocument: VersionedTextDocumentIdentifier;
  readonly tags: IARCCTSTag[];
}

export declare interface IARCCTSResult {
  readonly startOffset: number;
  readonly endOffset: number;
  readonly tagName: string;
  readonly originalWord: string;
  readonly originalOffset: number;
}

export declare type TARCCTVslSendRequest = <P, R, E>(
  type: RequestType<P, R, E>,
  params: P
) => Thenable<R>;

export declare interface IARCCTLanguageClientProxy {
  readonly code2ProtocolConverter: Code2ProtocolConverter;
  readonly sendRequest: TARCCTVslSendRequest;
}

export declare interface IARCCTTag {
  word: string;
  offset: number;
  oldWord: string;
  previousOffset: number;
}

export declare interface IARCCTParams {
  readonly textDocument: VersionedTextDocumentIdentifier;
  readonly tags: IARCCTTag[];
}

export declare interface IARCCTResult {
  readonly originalOffset: number;
  readonly originalWord: string;
  readonly startOffset: number;
  readonly endOffset: number;
  readonly tagName: string;
}
