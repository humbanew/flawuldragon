/// <reference types="vscode-languageclient/node" />

import { Code2ProtocolConverter } from 'vscode-languageclient/node';
import { TARTVslSendRequest } from './TARTVslSendRequest';

export declare interface IARTLanguageClientProxy {
  readonly code2ProtocolConverter: Code2ProtocolConverter;
  readonly sendRequest: TARTVslSendRequest;
}
