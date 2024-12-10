/// <reference types="vscode-languageclient/node" />

import {
  RequestType,
} from 'vscode-languageclient/node';

export declare type TARTVslSendRequest = <P, R, E>(
  type: RequestType<P, R, E>,
  params: P
) => Thenable<R>;
