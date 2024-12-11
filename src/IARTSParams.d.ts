/// <reference types="vscode-languageserver-protocol" />

import { VersionedTextDocumentIdentifier } from "vscode-languageclient";
import { IARTSTag } from "./IARTSTag";

export declare interface IARTSParams {
  readonly textDocument: VersionedTextDocumentIdentifier;
  readonly tags: IARTSTag[];
}
