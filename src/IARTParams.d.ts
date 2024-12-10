/// <reference types="vscode-languageserver-protocol" />

import { VersionedTextDocumentIdentifier } from "vscode-languageclient";
import { IARTTag } from "./IARTTag";

export declare interface IARTParams {
  readonly textDocument: VersionedTextDocumentIdentifier;
  readonly tags: IARTTag[];
}
