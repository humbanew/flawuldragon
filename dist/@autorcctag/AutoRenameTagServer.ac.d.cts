import { IARCCTSParams, IARCCTSResult } from './declares';
import { Connection, RequestType } from 'vscode-languageserver';
import { TextDocuments } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
export declare class AutoRenameTagServer {
    autoRenameTagRequestType: RequestType<IARCCTSParams, IARCCTSResult[], any>;
    NULL_AUTO_RENAME_TAG_RESULT: IARCCTSResult[];
    autoRenameTag: (documents: TextDocuments<TextDocument>) => (params: IARCCTSParams) => Promise<IARCCTSResult[]>;
    handleError: (error: Error) => void;
    useConnectionConsole: (connection: Connection, { trace }: {
        trace?: boolean;
    }) => (method: 'log' | 'info' | 'error') => (...args: any[]) => void;
    /**
     * Enables better stack traces for errors and logging.
     */
    enableBetterErrorHandlingAndLogging: (connection: Connection) => void;
    connection: Connection;
    documents: TextDocuments<TextDocument>;
    exec(): void;
}
//# sourceMappingURL=AutoRenameTagServer.ac.d.cts.map