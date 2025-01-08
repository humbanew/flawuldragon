import * as vscode from 'vscode';
import { IARCCTLanguageClientProxy, IARCCTTag, IARCCTParams, IARCCTResult } from './declares';
import { RequestType } from 'vscode-languageserver';
import { LanguageClientOptions } from 'vscode-languageclient/node';
export declare class AutoRenameTag {
    createLanguageClientProxy: (context: vscode.ExtensionContext, id: string, name: string, clientOptions: LanguageClientOptions) => Promise<IARCCTLanguageClientProxy>;
    assertDefined: <T>(value: T) => asserts value is NonNullable<T>;
    autoRenameTagRequestType: RequestType<IARCCTParams, IARCCTResult[], any>;
    askServerForAutoCompletionsElementRenameTag: (languageClientProxy: IARCCTLanguageClientProxy, document: vscode.TextDocument, tags: IARCCTTag[]) => Promise<IARCCTResult[]>;
    /**
     * Utility variable that stores the last changed version (document.uri.fsPath and document.version)
     * When a change was caused by auto-rename-tag, we can ignore that change, which is a simple performance improvement. One thing to take care of is undo, but that works now (and there are test cases).
     */
    lastChangeByAutoRenameTag: {
        fsPath: string;
        version: number;
    };
    applyResults: (results: IARCCTResult[]) => Promise<void>;
    latestCancelTokenSource: vscode.CancellationTokenSource | undefined;
    previousText: string | undefined;
    tagNameReLeft: RegExp;
    tagNameRERight: RegExp;
    wordsAtOffsets: {
        [offset: string]: {
            oldWord: string;
            newWord: string;
        };
    };
    updateWordsAtOffset: (tags: IARCCTTag[]) => void;
    doAutoCompletionElementRenameTag: (languageClientProxy: IARCCTLanguageClientProxy, tags: IARCCTTag[]) => Promise<void>;
    setPreviousText: (textEditor: vscode.TextEditor | undefined) => void;
    activate: (context: vscode.ExtensionContext) => Promise<void>;
}
//# sourceMappingURL=AutoRenameTag.ac.d.cts.map